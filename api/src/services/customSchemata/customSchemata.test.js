import {
  customSchemata,
  customSchema,
  createCustomSchema,
  updateCustomSchema,
  deleteCustomSchema,
} from './customSchemata'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('customSchemata', () => {
  scenario('returns all customSchemata', async (scenario) => {
    const result = await customSchemata()

    expect(result.length).toEqual(Object.keys(scenario.customSchema).length)
  })

  scenario('returns a single customSchema', async (scenario) => {
    const result = await customSchema({ id: scenario.customSchema.one.id })

    expect(result).toEqual(scenario.customSchema.one)
  })

  scenario('creates a customSchema', async () => {
    const result = await createCustomSchema({
      input: { table: 'String', section: 'String', schema: { foo: 'bar' } },
    })

    expect(result.table).toEqual('String')
    expect(result.section).toEqual('String')
    expect(result.schema).toEqual({ foo: 'bar' })
  })

  scenario('updates a customSchema', async (scenario) => {
    const original = await customSchema({
      id: scenario.customSchema.one.id,
    })
    const result = await updateCustomSchema({
      id: original.id,
      input: { table: 'String2' },
    })

    expect(result.table).toEqual('String2')
  })

  scenario('deletes a customSchema', async (scenario) => {
    const original = await deleteCustomSchema({
      id: scenario.customSchema.one.id,
    })
    const result = await customSchema({ id: original.id })

    expect(result).toEqual(null)
  })
})
