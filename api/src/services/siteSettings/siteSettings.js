import { keyBy, merge } from 'lodash'

import { db } from 'src/lib/db'

import { settingsSchemas, transformSettings } from './siteSettings.validation'

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
  return transformSettings(settings)
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
      const current = currentSettings[setting.id]?.value
      if (current && typeof current == 'object') {
        delete current.updated_by
        delete current.updated_at
        setting.value = merge(current, setting.value)
      }
      prepareUpdate(setting)

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
