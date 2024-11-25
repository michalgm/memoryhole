import {
  optionSets,
  optionSet,
  createOptionSet,
  updateOptionSet,
  deleteOptionSet,
} from './optionSets'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('optionSets', () => {
  scenario('returns all optionSets', async (scenario) => {
    const result = await optionSets()

    expect(result.length).toEqual(Object.keys(scenario.optionSet).length)
  })

  scenario('returns a single optionSet', async (scenario) => {
    const result = await optionSet({ id: scenario.optionSet.one.id })

    expect(result).toEqual({ ...scenario.optionSet.one, values: [] })
  })

  scenario('creates a optionSet', async () => {
    const result = await createOptionSet({
      input: { name: 'String6189549' },
    })

    expect(result.name).toEqual('String6189549')
  })

  scenario('updates a optionSet', async (scenario) => {
    const original = await optionSet({
      id: scenario.optionSet.one.id,
    })
    const result = await updateOptionSet({
      id: original.id,
      input: { name: 'String55256632' },
    })

    expect(result.name).toEqual('String55256632')
  })

  scenario('deletes a optionSet', async (scenario) => {
    const original = await deleteOptionSet({
      id: scenario.optionSet.one.id,
    })
    const result = await optionSet({ id: original.id })

    expect(result).toEqual(null)
  })
})
