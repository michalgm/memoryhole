import { transformSettings } from 'src/services/siteSettings/siteSettings.validation'

let settingsCache = {}

export const updateSettingsCache = async (client) => {
  const settings = await client.siteSetting.findMany()
  const transformed = await transformSettings(settings)
  transformed.forEach(({ id, value }) => {
    if (!['siteHelp'].includes(id)) {
      settingsCache[id] = value
    }
  })
  // console.log(settingsCache)
}
export const getSetting = (key) => settingsCache?.[key]
