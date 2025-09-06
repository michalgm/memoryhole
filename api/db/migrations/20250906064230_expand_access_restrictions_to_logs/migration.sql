ALTER TABLE "User"
RENAME COLUMN "arrest_date_max" TO "access_date_max";

ALTER TABLE "User"
RENAME COLUMN "arrest_date_min" TO "access_date_min";

ALTER TABLE "User"
RENAME COLUMN "arrest_date_threshold" TO "access_date_threshold";

UPDATE "SiteSetting"
SET
  "value"=JSONB_BUILD_OBJECT(
    'expiresAt',
    COALESCE("value"->'expiresAt', 'true'::jsonb),
    'actions',
    COALESCE("value"->'actions', 'true'::jsonb),
    'access_date_max',
    COALESCE("value"->'arrest_date_max', 'true'::jsonb),
    'access_date_min',
    COALESCE("value"->'arrest_date_min', 'true'::jsonb),
    'access_date_threshold',
    COALESCE("value"->'arrest_date_threshold', 'true'::jsonb)
  )
WHERE
  "id"='restriction_settings';

UPDATE "SiteSetting"
SET
  "value"=(
    REPLACE("value"::TEXT, 'arrest_date_', 'access_date_')
  )::JSONB
WHERE
  "id"='default_restrictions';
