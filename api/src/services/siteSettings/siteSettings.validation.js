import { keyBy } from 'lodash'
import { z } from 'zod'

const restrictionSchema = z
  .object({
    expiresAt: z.number().nullable().default(null),
    access_date_min: z.number().nullable().default(null),
    access_date_min_direction: z.enum(['before', 'after']).default('before'),
    access_date_max: z.number().nullable().default(null),
    access_date_max_direction: z.enum(['before', 'after']).default('before'),
    access_date_threshold: z.number().nullable().default(null),
  })
  .strict()
  .default({})

const defaultRestrictionsSchema = z
  .object({
    operator: restrictionSchema,
    coordinator: restrictionSchema,
    admin: restrictionSchema,
  })
  .strict()
  .default({})

const restrictionSettingsSchema = z
  .object({
    expiresAt: z.boolean().default(true),
    actions: z.boolean().default(true),
    access_date_min: z.boolean().default(true),
    access_date_max: z.boolean().default(true),
    access_date_threshold: z.boolean().default(true),
  })
  .strict()
  .default({})

export const settingsSchemas = {
  siteHelp: z.string().default('help'),
  restriction_settings: restrictionSettingsSchema,
  default_restrictions: defaultRestrictionsSchema,
}

export const transformSettings = (settings) => {
  const settingsMap = keyBy(settings, 'id')

  return Object.entries(settingsSchemas).reduce((acc, [key, schema]) => {
    const setting = settingsMap[key] || { id: key }
    setting.value = schema.parse(setting?.value || undefined)

    acc.push(setting)
    return acc
  }, [])
}
