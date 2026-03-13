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
  timeZone: z.string().default('America/Los_Angeles'),
  restriction_settings: restrictionSettingsSchema,
  default_restrictions: defaultRestrictionsSchema,
  smtp_host: z
    .union([
      z
        .string()
        .regex(
          /^((?=[a-zA-Z0-9-]{1,63}\.)[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,63}(:\d{1,5})?$|^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d{1,5})?$/,
          'Invalid SMTP host'
        ),
      z.string().optional(),
    ])
    .default('protonmail-bridge:1025'),
  smtp_user: z.string().default(''),
  smtp_pass: z.string().default(''),
  smtp_secure: z.boolean().default(false),
}

export const transformSettings = (settings) => {
  const settingsMap = keyBy(settings, 'id')

  return Object.entries(settingsSchemas).reduce((acc, [key, schema]) => {
    const setting = settingsMap[key] || { id: key }
    // console.error('Transforming setting', key, setting.value)
    setting.value = schema.parse(setting?.value || undefined)

    acc.push(setting)
    return acc
  }, [])
}
