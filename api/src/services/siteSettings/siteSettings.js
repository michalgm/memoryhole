import { keyBy, merge } from 'lodash'

import { encrypt } from 'src/lib/crypto'
import { db } from 'src/lib/db'
import { sendEmail } from 'src/lib/email'

import { settingsSchemas, transformSettings } from './siteSettings.validation'

const ENCRYPTED_SETTINGS = ['smtp_pass']
export const ENCRYPTED_SETTING_SENTINEL = '__REDACTED__'

const redactSettings = (settings) =>
  settings.map((s) =>
    ENCRYPTED_SETTINGS.includes(s.id)
      ? { ...s, value: s.value ? ENCRYPTED_SETTING_SENTINEL : '' }
      : s
  )

const prepareUpdate = (input) => {
  input.updated_by = { connect: { id: context.currentUser.id } }
  if (!settingsSchemas[input.id]) {
    throw new Error(`Invalid setting id: ${input.id}`)
  }
  settingsSchemas[input.id].parse(input.value)
  return input
}
export const siteSettings = async ({ ids } = {}) => {
  const where = ids ? { id: { in: ids } } : {}
  const settings = await db.siteSetting.findMany({ where })
  const transformed = redactSettings(transformSettings(settings))
  if (!ids) {
    return transformed
  }
  return transformed.filter((s) => ids.includes(s.id))
}

export const siteSetting = ({ id }) => {
  return db.siteSetting.findUnique({
    where: { id },
  })
}

export const createSiteSetting = ({ input }) => {
  prepareUpdate(input)
  return db.siteSetting.create({
    data: input,
  })
}

export const upsertSiteSetting = ({ input }) => {
  prepareUpdate(input)
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
      // Never overwrite an encrypted setting with blank or sentinel — skip if unchanged
      if (
        ENCRYPTED_SETTINGS.includes(setting.id) &&
        (!setting.value || setting.value === ENCRYPTED_SETTING_SENTINEL)
      ) {
        return
      }

      const current = currentSettings[setting.id]?.value
      if (current && typeof current === 'object') {
        delete current.updated_by
        delete current.updated_at
        setting.value = merge(current, setting.value)
      }
      prepareUpdate(setting)

      if (ENCRYPTED_SETTINGS.includes(setting.id)) {
        setting.value = encrypt(setting.value)
      }

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
  input = prepareUpdate({ id, ...input })
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

export const sendTestEmail = async ({ to }) => {
  await sendEmail({
    to,
    subject: 'Memoryhole test email',
    text: 'This is a test email from Memoryhole to verify your email settings are working correctly.',
  })
  return true
}
