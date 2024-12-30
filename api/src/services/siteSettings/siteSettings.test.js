import {
  createSiteSetting,
  deleteSiteSetting,
  siteSetting,
  siteSettings,
  updateSiteSetting,
  upsertSiteSetting,
} from './siteSettings'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('siteSettings', () => {
  scenario('returns all siteSettings', async (scenario) => {
    const result = await siteSettings()
    expect(result.length).toBeGreaterThanOrEqual(
      Object.keys(scenario.siteSetting).length
    )
  })

  scenario('returns a single siteSetting', async (scenario) => {
    const result = await siteSetting({ id: scenario.siteSetting.one.id })

    expect(result).toEqual(scenario.siteSetting.one)
  })

  scenario('creates a siteSetting', async () => {
    mockCurrentUser({ name: 'Rob', id: 1 })

    const result = await createSiteSetting({
      input: {
        id: 'default_restrictions',
        value: { user: {}, coordinator: {}, admin: {} },
      },
    })

    expect(result.id).toEqual('default_restrictions')
    expect(result.value).toEqual({ user: {}, coordinator: {}, admin: {} })
  })

  scenario('updates a siteSetting', async (scenario) => {
    mockCurrentUser({ name: 'Rob', id: 1 })
    const original = await siteSetting({
      id: scenario.siteSetting.one.id,
    })
    const result = await updateSiteSetting({
      id: original.id,
      input: { value: 'String2' },
    })
    expect(result.value).toEqual('String2')
    expect(result.updated_by_id).toEqual(1)
  })

  scenario('updates a siteSetting on upsert', async (scenario) => {
    mockCurrentUser({ name: 'Rob', id: 1 })

    const original = await siteSetting({
      id: scenario.siteSetting.one.id,
    })
    const result = await upsertSiteSetting({
      input: { id: original.id, value: 'String2' },
    })

    expect(result.value).toEqual('String2')
    expect(result.id).toEqual(original.id)
  })

  scenario('creates a siteSetting on upsert', async () => {
    mockCurrentUser({ name: 'Rob', id: 1 })

    const result = await upsertSiteSetting({
      input: { id: 'siteHelp', value: 'String3' },
    })

    expect(result.value).toEqual('String3')
    expect(result.id).toEqual('siteHelp')
  })

  scenario('deletes a siteSetting', async (scenario) => {
    const original = await deleteSiteSetting({
      id: scenario.siteSetting.one.id,
    })
    const result = await siteSetting({ id: original.id })

    expect(result).toEqual(null)
  })
})
