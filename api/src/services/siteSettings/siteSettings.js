import { keyBy, merge } from 'lodash'
import { z } from 'zod'

import { db } from 'src/lib/db'
const restrictionSchema = z
  .object({
    expiresAt: z.number().nullable().default(null),
    arrest_date_min: z.number().nullable().default(null),
    arrest_date_min_direction: z.enum(['before', 'after']).default('before'),
    arrest_date_max: z.number().nullable().default(null),
    arrest_date_max_direction: z.enum(['before', 'after']).default('before'),
    arrest_date_threshold: z.number().nullable().default(null),
  })
  .strict()
const defaultRestrictionsSchema = z
  .object({
    user: restrictionSchema,
    coordinator: restrictionSchema,
    admin: restrictionSchema,
  })
  .strict()

const settingsSchemas = {
  siteHelp: z.string().default('help'),
  default_restriction_settings: z
    .object({
      expiresAt: z.boolean().default(true),
      arrest_date_min: z.boolean().default(true),
      arrest_date_max: z.boolean().default(true),
      arrest_date_threshold: z.boolean().default(true),
    })
    .strict(),
  default_restrictions: defaultRestrictionsSchema,
}

export const siteSettings = async ({ ids } = {}) => {
  const where = ids ? { id: { in: ids } } : {}
  const settings = await db.siteSetting.findMany({ where })
  return settings.map((setting) => {
    if (settingsSchemas[setting.id]) {
      setting.value = settingsSchemas[setting.id].parse(setting.value)
    }
    return setting
  })
}

export const siteSetting = ({ id }) => {
  return db.siteSetting.findUnique({
    where: { id },
  })
}

export const createSiteSetting = ({ input }) => {
  input.updated_by = { connect: { id: context.currentUser.id } }
  return db.siteSetting.create({
    data: input,
  })
}

export const upsertSiteSetting = ({ input }) => {
  input.updated_by = { connect: { id: context.currentUser.id } }
  return db.siteSetting.upsert({
    where: { id: input.id },
    create: input,
    update: input,
  })
}

export const bulkUpsertSiteSetting = async ({ input }) => {
  await db.$transaction(async (tx) => {
    const currentSettings = keyBy(await tx.siteSetting.findMany(), 'id')

    const promises = input.map(async (setting) => {
      const current = currentSettings[setting.id]?.value
      if (current && typeof current == 'object') {
        delete current.updated_by
        delete current.updated_at
        setting.value = merge(current, setting.value)
      }

      settingsSchemas[setting.id].parse(setting.value)
      setting.updated_by = { connect: { id: context.currentUser.id } }

      return tx.siteSetting.upsert({
        where: { id: setting.id },
        create: setting,
        update: setting,
      })
    })
    return Promise.all(promises)
  })
  return siteSettings()
}

export const updateSiteSetting = ({ id, input }) => {
  input.updated_by = { connect: { id: context.currentUser.id } }
  return db.siteSetting.update({
    data: input,
    where: { id },
  })
}

export const deleteSiteSetting = ({ id }) => {
  return db.siteSetting.delete({
    where: { id },
  })
}

export const SiteSetting = {
  updated_by: (_obj, { root }) => {
    return db.siteSetting.findUnique({ where: { id: root?.id } }).updated_by()
  },
}
