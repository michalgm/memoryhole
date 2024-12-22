import {
  createSiteSetting,
  deleteSiteSetting,
  siteSetting,
  siteSettings,
  updateSiteSetting,
} from './siteSettings'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('siteSettings', () => {
  scenario('returns all siteSettings', async (scenario) => {
    const result = await siteSettings()

    expect(result.length).toEqual(Object.keys(scenario.siteSetting).length)
  })

  scenario('returns a single siteSetting', async (scenario) => {
    const result = await siteSetting({ id: scenario.siteSetting.one.id })

    expect(result).toEqual(scenario.siteSetting.one)
  })

  scenario('creates a siteSetting', async () => {
    const result = await createSiteSetting({
      input: { id: 'String3', value: { foo: 'bar' } },
    })

    expect(result.id).toEqual('String3')
    expect(result.value).toEqual({ foo: 'bar' })
  })

  scenario('updates a siteSetting', async (scenario) => {
    const original = await siteSetting({
      id: scenario.siteSetting.one.id,
    })
    const result = await updateSiteSetting({
      id: original.id,
      input: { value: 'String2' },
    })

    expect(result.value).toEqual('String2')
  })

  scenario('deletes a siteSetting', async (scenario) => {
    const original = await deleteSiteSetting({
      id: scenario.siteSetting.one.id,
    })
    const result = await siteSetting({ id: original.id })

    expect(result).toEqual(null)
  })
})
