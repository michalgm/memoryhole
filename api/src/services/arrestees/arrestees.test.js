import {
  arrestees,
  arrestee,
  createArrestee,
  updateArrestee,
  deleteArrestee,
} from './arrestees'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('arrestees', () => {
  scenario('returns all arrestees', async (scenario) => {
    const result = await arrestees()

    expect(result.length).toEqual(Object.keys(scenario.arrestee).length)
  })

  scenario('returns a single arrestee', async (scenario) => {
    const result = await arrestee({ id: scenario.arrestee.one.id })

    expect(result).toEqual(scenario.arrestee.one)
  })

  scenario('creates a arrestee', async () => {
    const result = await createArrestee({
      input: { display_field: 'String', search_field: 'String' },
    })

    expect(result.display_field).toEqual('String')
    expect(result.search_field).toEqual('String')
  })

  scenario('updates a arrestee', async (scenario) => {
    const original = await arrestee({
      id: scenario.arrestee.one.id,
    })
    const result = await updateArrestee({
      id: original.id,
      input: { display_field: 'String2' },
    })

    expect(result.display_field).toEqual('String2')
  })

  scenario('deletes a arrestee', async (scenario) => {
    const original = await deleteArrestee({
      id: scenario.arrestee.one.id,
    })
    const result = await arrestee({ id: original.id })

    expect(result).toEqual(null)
  })
})
