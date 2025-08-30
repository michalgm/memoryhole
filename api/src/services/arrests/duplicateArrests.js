import { Prisma } from '@prisma/client'
import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'
import { filterArrestAccess } from './arrests'

const minScore = 10

/** weights should sum to ~100 for readability (we’ll normalize anyway) */
const weights = {
  name: 25,          // combines first/preferred + strong last-name component internally
  dob: 40,
  email: 8,
  phone: 8,
  date_proximity: 9
}

const defaultMaxArrestDateDifferenceSeconds = 60 * 60 * 12 // 12h
const lastNameSimGate = 0.68             // tighten/loosen
const lastNameLevGate = 2                // alternative gate

export const duplicateArrests = async ({
  maxArrestDateDifferenceSeconds = defaultMaxArrestDateDifferenceSeconds,
  strictCityMatch = false,
  strictDOBMatch = false,
  includeIgnored = false
} = {}) => {

  requireAuth()

  // Normalize weights to 0..1 and keep a 0..100 total for readability
  const totalW =
    weights.name +
    weights.dob +
    weights.email +
    weights.phone +
    weights.date_proximity

  const W = {
    name: weights.name / totalW,
    dob: weights.dob / totalW,
    email: weights.email / totalW,
    phone: weights.phone / totalW,
    date_proximity: weights.date_proximity / totalW,
  }

  // Parameterized SQL
  const query = Prisma.sql`WITH -- Normalize names, email, phone; keep relevant fields
norm AS (
  SELECT a.id,
    a.arrestee_id,
    lower(unaccent(coalesce(b.first_name, ''))) AS first_name,
    lower(unaccent(coalesce(b.preferred_name, ''))) AS preferred_name,
    lower(unaccent(coalesce(b.last_name, ''))) AS last_name,
    lower(coalesce(b.email, '')) AS email,
    regexp_replace(coalesce(b.phone_1, ''), '[^0-9]+', '', 'g') AS phone,
    date,
    arrest_city,
    dob
  FROM "Arrest" a
    JOIN "Arrestee" b ON a.arrestee_id = b.id
),
pairs AS (
  SELECT n1.id AS arrest1_id,
    n2.id AS arrest2_id,
    n1.arrestee_id AS arrestee1_id,
    n2.arrestee_id AS arrestee2_id,
    -- -----------------------------
    -- Last name gating components
    -- -----------------------------
    similarity(n1.last_name, n2.last_name) AS last_name_sim,
    (dmetaphone(n1.last_name) = dmetaphone(n2.last_name))::int AS last_name_phone,
    levenshtein(n1.last_name, n2.last_name) AS last_name_lev,
    -- -----------------------------
    -- First/Preferred cross-comparison
    -- take the best across the 4 pairings
    -- -----------------------------
    GREATEST(
      similarity(n1.first_name, n2.first_name),
      similarity(n1.first_name, n2.preferred_name),
      similarity(n1.preferred_name, n2.first_name),
      similarity(n1.preferred_name, n2.preferred_name)
    ) AS fp_sim,
    (
      (dmetaphone(n1.first_name) = dmetaphone(n2.first_name))
      OR (dmetaphone(n1.first_name) = dmetaphone(n2.preferred_name))
      OR (dmetaphone(n1.preferred_name) = dmetaphone(n2.first_name))
      OR (dmetaphone(n1.preferred_name) = dmetaphone(n2.preferred_name))
    )::int AS fp_phone,
    LEAST(
      1.0,
      GREATEST(
        0.0,
        1.0 - LEAST(
          levenshtein(n1.first_name, n2.first_name),
          levenshtein(n1.first_name, n2.preferred_name),
          levenshtein(n1.preferred_name, n2.first_name),
          levenshtein(n1.preferred_name, n2.preferred_name)
        ) / 4.0
      )
    ) AS fp_lev_score,
    -- DOB exact match → 1 else 0 (if either missing, 0)
    (
      CASE
      WHEN n1.dob IS NULL OR n2.dob IS NULL THEN NULL::float8
        WHEN n1.dob = n2.dob THEN 1
        ELSE 0
      END
    )::float8 AS dob_score,
    -- Email exact (normalized lower) → 1 else 0 (skip if either empty)
    (
      CASE
        WHEN n1.email = '' OR n2.email = '' THEN NULL::float8
        WHEN n1.email = n2.email THEN 1
        ELSE 0
      END
    )::float8 AS email_score,
    -- Phone exact (digits only) → 1 else 0 (skip if either empty)
    (
      CASE
        WHEN n1.phone = '' OR n2.phone = '' THEN NULL::float8
        WHEN n1.phone = n2.phone THEN 1
        ELSE 0
      END
    )::float8 AS phone_score,
    -- Date proximity: 1 at 0s apart; linearly down to 0 at window end; else 0
    (
      CASE
        WHEN abs(
          extract(
            epoch
            from (n1.date - n2.date)
          )
        ) <= ${maxArrestDateDifferenceSeconds} THEN 1.0 - (
          abs(
            extract(
              epoch
              from (n1.date - n2.date)
            )
          ) / ${maxArrestDateDifferenceSeconds}
        )
        ELSE 0.0
      END
    ) AS date_proximity_score
  FROM norm n1
    JOIN norm n2 ON n1.id < n2.id -- Prefilter to keep the join manageable
  WHERE (
      n1.last_name % n2.last_name
      OR n1.first_name % n2.first_name
      OR (
        n1.preferred_name <> ''
        AND n1.preferred_name % n2.first_name
      )
      OR (
        n2.preferred_name <> ''
        AND n2.preferred_name % n1.first_name
      )
    )
    AND (NOT ${strictCityMatch} OR n1.arrest_city = n2.arrest_city)
    AND (NOT ${strictDOBMatch} OR (n1.dob IS NULL OR n2.dob IS NULL OR n1.dob = n2.dob))
    AND (${includeIgnored} OR NOT EXISTS (
      SELECT 1 FROM "IgnoredDuplicateArrest" ida
      WHERE (ida.arrest1_id = n1.id AND ida.arrest2_id = n2.id)
    ))
),
gated AS (
  -- Enforce last-name gate (must pass at least one criterion if both present)
  SELECT p.*,
    (
      CASE
        WHEN (
          p.last_name_sim >= ${lastNameSimGate}
          OR p.last_name_lev <= ${lastNameLevGate}
          OR p.last_name_phone = 1
        ) THEN 1
        ELSE 0
      END
    ) AS last_name_gate_ok
  FROM pairs p
),
scored AS (
  SELECT arrest1_id,
    arrest2_id,
    arrestee1_id,
    arrestee2_id,
    -- Name subscore 0..1:
    -- last name (heavy) + first/preferred (best of four) + small phonetic/lev tie-ins
    LEAST(
      1.0,
      0.70 * last_name_sim + 0.25 * fp_sim + 0.04 * (0.6 * last_name_phone + 0.4 * fp_phone) + 0.01 * (
        CASE
          WHEN last_name_lev <= 1 THEN 1
          ELSE 0
        END
      ) -- tiny bump for near-perfect last name
    ) * last_name_gate_ok AS name_score,
    dob_score,
    email_score,
    phone_score,
    date_proximity_score
  FROM gated
  WHERE last_name_gate_ok = 1
)
SELECT arrest1_id,
  arrest2_id,
  arrestee1_id,
  arrestee2_id,
  -- final 0..100 score (weighted sum of 0..1 subscores)
  ROUND(
    100.0 * (
      ${W.name} * name_score +
      ${W.dob} * coalesce(dob_score, 0) +
      ${W.email} * coalesce(email_score, 0) +
      ${W.phone} * coalesce(phone_score, 0) +
      ${W.date_proximity} * coalesce(date_proximity_score, 0)
    )::numeric /
      NULLIF(
        ${W.name} +
    (CASE WHEN dob_score   IS NOT NULL THEN ${W.dob} ELSE 0 END) +
    (CASE WHEN email_score IS NOT NULL THEN ${W.email} ELSE 0 END) +
    (CASE WHEN phone_score IS NOT NULL THEN ${W.phone} ELSE 0 END) +
    (CASE WHEN date_proximity_score IS NOT NULL THEN ${W.date_proximity} ELSE 0 END)
     , 0 )
    ,
    2
  )AS final_score,
  -- expose components for UI
  name_score,
  coalesce(dob_score, 0) AS dob_score,
  coalesce(email_score, 0) AS email_score,
  coalesce(phone_score, 0) AS phone_score,
  coalesce(date_proximity_score, 0) AS date_proximity_score
FROM scored
WHERE (
    ${W.name} * name_score +
    ${W.dob} * coalesce(dob_score, 0) +
    ${W.email} * coalesce(email_score, 0) +
    ${W.phone} * coalesce(phone_score, 0) +
    ${W.date_proximity} * coalesce(date_proximity_score, 0)
  ) >= ${minScore / 100.0}
ORDER BY final_score DESC
`

  const rows = await db.$queryRaw(query)

  // hydrate results
  const ids = Array.from(new Set(rows.flatMap(r => [r.arrest1_id, r.arrest2_id])))
  const arrests = await db.arrest.findMany({
    where: filterArrestAccess({ id: { in: ids } }),
    include: { arrestee: true },
  })
  const byId = new Map(arrests.map(a => [a.id, a]))

  return rows.reduce((acc, r) => {
    const arrest1 = byId.get(r.arrest1_id)
    const arrest2 = byId.get(r.arrest2_id)
    if (arrest1 && arrest2) {
      acc.push({
        arrest1_id: r.arrest1_id,
        arrest2_id: r.arrest2_id,
        matchScore: r.final_score,
        nameScore: r.name_score,
        dobScore: r.dob_score,
        emailScore: r.email_score,
        phoneScore: r.phone_score,
        dateProximityScore: r.date_proximity_score,
        arrest1: byId.get(r.arrest1_id),
        arrest2: byId.get(r.arrest2_id),
      })
    }
    return acc
  }, [])
}
