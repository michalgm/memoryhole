import { transformSettings } from 'src/services/siteSettings/siteSettings.validation'

const buildCache = (settings) =>
  Object.fromEntries(
    transformSettings(settings)
      .filter(({ id }) => !['siteHelp'].includes(id))
      .map(({ id, value }) => [id, value])
  )

// Start from the schema defaults (which keep access restrictions on) so code
// that runs before the cache is loaded from the database - or in processes that
// never load it, like scripts and data migrations - isn't silently unrestricted
let settingsCache = buildCache([])

export const updateSettingsCache = async (client) => {
  const settings = await client.siteSetting.findMany()
  settingsCache = buildCache(settings)
  // console.log(settingsCache)
}
export const getSetting = (key) => settingsCache?.[key] ?? {}
