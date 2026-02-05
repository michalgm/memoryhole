import { optionSet, optionSets, updateOptionSetValues } from './optionSets'

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

  // scenario('creates a optionSet', async () => {
  //   const result = await createOptionSet({
  //     input: { name: 'String6189549' },
  //   })

  //   expect(result.name).toEqual('String6189549')
  // })

  scenario('updates a optionSet', async (scenario) => {
    // Fetch the original option set and its values
    const original = await optionSet({ id: scenario.optionSet.one.id })
    // Add a new value, update the first value, and mark the second for deletion (if present)
    const existingValues = original.values || []
    const updatedValues = []
    if (existingValues[0]) {
      updatedValues.push({
        ...existingValues[0],
        label: existingValues[0].label + ' updated',
      })
    }
    if (existingValues[1]) {
      updatedValues.push({
        ...existingValues[1],
        deleted: true,
      })
    }
    updatedValues.push({
      label: 'New Value',
      value: 'new_value',
      order: (existingValues.length || 0) + 1,
    })

    const result = await updateOptionSetValues({
      id: original.id,
      input: {
        values: updatedValues,
      },
    })

    // Check updated value
    if (existingValues[0]) {
      expect(
        result.values.find((v) => v.id === existingValues[0].id).label
      ).toEqual(existingValues[0].label + ' updated')
    }
    // Check deleted value is gone
    if (existingValues[1]) {
      expect(
        result.values.find((v) => v.id === existingValues[1].id)
      ).toBeUndefined()
    }
    // Check new value is present
    expect(
      result.values.some(
        (v) => v.label === 'New Value' && v.value === 'new_value'
      )
    ).toBe(true)
  })

  describe('validation', () => {
    scenario(
      'prevents deleting an option value that is in use',
      async (scenario) => {
        // "MyLogType" is used by scenario.log.one
        const original = await optionSet({ id: scenario.optionSet.logType.id })
        const valueToDelete = original.values.find(
          (v) => v.value === 'MyLogType'
        )

        await expect(
          updateOptionSetValues({
            id: original.id,
            input: {
              values: [{ id: valueToDelete.id, deleted: true }],
            },
          })
        ).rejects.toThrow(/is currently used by 1 log\(s\)/)
      }
    )

    scenario(
      'prevents renaming an option value that is in use',
      async (scenario) => {
        const original = await optionSet({ id: scenario.optionSet.logType.id })
        const valueToRename = original.values.find(
          (v) => v.value === 'MyLogType'
        )

        await expect(
          updateOptionSetValues({
            id: original.id,
            input: {
              values: [{ ...valueToRename, value: 'RenamedType' }],
            },
          })
        ).rejects.toThrow(/is currently used by 1 log\(s\)/)
      }
    )

    scenario(
      'prevents deleting an option value that is a default',
      async (scenario) => {
        // "Unknown" is the default for jail_population (arrestee.custom_fields.jail_population)
        const original = await optionSet({
          id: scenario.optionSet.jailPopulation.id,
        })
        const valueToDelete = original.values.find((v) => v.value === 'Unknown')

        await expect(
          updateOptionSetValues({
            id: original.id,
            input: {
              values: [{ id: valueToDelete.id, deleted: true }],
            },
          })
        ).rejects.toThrow(/is the default value/)
      }
    )

    scenario('allows deleting unused values', async (scenario) => {
      const original = await optionSet({ id: scenario.optionSet.logType.id })
      const unusedValue = original.values.find(
        (v) => v.value === 'OtherLogType'
      )

      const result = await updateOptionSetValues({
        id: original.id,
        input: {
          values: [{ id: unusedValue.id, deleted: true }],
        },
      })
      expect(result.values.find((v) => v.id === unusedValue.id)).toBeUndefined()
    })
  })
})
