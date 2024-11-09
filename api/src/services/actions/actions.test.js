import {
  actions,
  action,
  createAction,
  updateAction,
  deleteAction,
} from './actions'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('actions', () => {
  scenario('returns all actions', async (scenario) => {
    const result = await actions()

    expect(result.length).toEqual(Object.keys(scenario.action).length)
  })

  scenario('returns a single action', async (scenario) => {
    const result = await action({ id: scenario.action.one.id })

    expect(result).toEqual(scenario.action.one)
  })

  scenario('creates a action', async () => {
    const result = await createAction({
      input: { name: 'String', start_date: '2024-11-05T10:43:41.123Z' },
    })

    expect(result.name).toEqual('String')
    expect(result.start_date).toEqual(new Date('2024-11-05T10:43:41.123Z'))
  })

  scenario('updates a action', async (scenario) => {
    const original = await action({ id: scenario.action.one.id })
    const result = await updateAction({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a action', async (scenario) => {
    const original = await deleteAction({
      id: scenario.action.one.id,
    })
    const result = await action({ id: original.id })

    expect(result).toEqual(null)
  })
})
