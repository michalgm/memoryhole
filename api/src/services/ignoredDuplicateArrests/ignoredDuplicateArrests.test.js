import {
  createIgnoredDuplicateArrest,
  deleteIgnoredDuplicateArrest,
  ignoredDuplicateArrest,
  ignoredDuplicateArrests,
  updateIgnoredDuplicateArrest,
} from './ignoredDuplicateArrests'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('ignoredDuplicateArrests', () => {
  scenario('returns all ignoredDuplicateArrests', async (scenario) => {
    const result = await ignoredDuplicateArrests()

    expect(result.length).toEqual(
      Object.keys(scenario.ignoredDuplicateArrest).length
    )
  })

  scenario('returns a single ignoredDuplicateArrest', async (scenario) => {
    const result = await ignoredDuplicateArrest({
      id: scenario.ignoredDuplicateArrest.one.id,
    })

    expect(result).toEqual(scenario.ignoredDuplicateArrest.one)
  })

  scenario('creates a ignoredDuplicateArrest', async (scenario) => {
    mockCurrentUser({ name: 'Rob', id: 10 })

    const result = await createIgnoredDuplicateArrest({
      arrest1_id: scenario.ignoredDuplicateArrest.two.arrest1_id,
      arrest2_id: scenario.ignoredDuplicateArrest.two.arrest2_id,
    })

    expect([result.arrest1_id, result.arrest2_id]).toContain(
      scenario.ignoredDuplicateArrest.two.arrest1_id
    )

    expect([result.arrest1_id, result.arrest2_id]).toContain(
      scenario.ignoredDuplicateArrest.two.arrest2_id
    )

    expect(result.createdById).toEqual(
      scenario.ignoredDuplicateArrest.two.createdById
    )
  })

  scenario('updates a ignoredDuplicateArrest', async (scenario) => {
    const original = await ignoredDuplicateArrest({
      id: scenario.ignoredDuplicateArrest.one.id,
    })
    const result = await updateIgnoredDuplicateArrest({
      id: original.id,
      input: { arrest1_id: scenario.ignoredDuplicateArrest.two.arrest1_id },
    })

    expect(result.arrest1_id).toEqual(
      scenario.ignoredDuplicateArrest.two.arrest1_id
    )
  })

  scenario('deletes a ignoredDuplicateArrest', async (scenario) => {
    const original = await deleteIgnoredDuplicateArrest({
      id: scenario.ignoredDuplicateArrest.one.id,
    })
    const result = await ignoredDuplicateArrest({ id: original.id })

    expect(result).toEqual(null)
  })
})
