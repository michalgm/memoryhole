import {
  arrests,
  arrest,
  createArrest,
  updateArrest,
  deleteArrest,
} from './arrests'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('arrests', () => {
  scenario('returns all arrests', async (scenario) => {
    const result = await arrests()

    expect(result.length).toEqual(Object.keys(scenario.arrest).length)
  })

  scenario('returns a single arrest', async (scenario) => {
    const result = await arrest({ id: scenario.arrest.one.id })

    expect(result).toEqual(scenario.arrest.one)
  })

  scenario('creates a arrest', async () => {
    const result = await createArrest({
      input: { display_field: 'String', search_field: 'String' },
    })

    expect(result.display_field).toEqual('String')
    expect(result.search_field).toEqual('String')
  })

  scenario('updates a arrest', async (scenario) => {
    const original = await arrest({ id: scenario.arrest.one.id })
    const result = await updateArrest({
      id: original.id,
      input: { display_field: 'String2' },
    })

    expect(result.display_field).toEqual('String2')
  })

  scenario('deletes a arrest', async (scenario) => {
    const original = await deleteArrest({
      id: scenario.arrest.one.id,
    })
    const result = await arrest({ id: original.id })

    expect(result).toEqual(null)
  })
})
