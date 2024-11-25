import {
  createOptionSetValue,
  deleteOptionSetValue,
  optionSetValue,
  optionSetValues,
  updateOptionSetValue,
} from './optionSetValues'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('optionSetValues', () => {
  scenario('returns all optionSetValues', async (scenario) => {
    const result = await optionSetValues()

    expect(result.length).toEqual(Object.keys(scenario.optionSetValue).length)
  })

  scenario('returns a single optionSetValue', async (scenario) => {
    const result = await optionSetValue({
      id: scenario.optionSetValue.one.id,
    })

    expect(result).toEqual(scenario.optionSetValue.one)
  })

  scenario('creates a optionSetValue', async (scenario) => {
    const result = await createOptionSetValue({
      input: {
        option_set_id: scenario.optionSetValue.two.option_set_id,
        label: 'String3',
        value: 'String3',
      },
    })

    expect(result.option_set_id).toEqual(
      scenario.optionSetValue.two.option_set_id
    )
    expect(result.label).toEqual('String3')
    expect(result.value).toEqual('String3')
  })

  scenario('updates a optionSetValue', async (scenario) => {
    const original = await optionSetValue({
      id: scenario.optionSetValue.one.id,
    })
    const result = await updateOptionSetValue({
      id: original.id,
      input: { label: 'String2' },
    })

    expect(result.label).toEqual('String2')
  })

  scenario('deletes a optionSetValue', async (scenario) => {
    const original = await deleteOptionSetValue({
      id: scenario.optionSetValue.one.id,
    })
    const result = await optionSetValue({ id: original.id })

    expect(result).toEqual(null)
  })
})
