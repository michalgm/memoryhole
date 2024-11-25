import { users, user, createUser, updateUser, deleteUser } from './users'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('users', () => {
  scenario('returns all users', async (scenario) => {
    const result = await users()

    expect(result.length).toEqual(Object.keys(scenario.user).length)
  })

  scenario('returns a single user', async (scenario) => {
    const result = await user({ id: scenario.user.one.id })

    expect(result).toEqual(scenario.user.one)
  })

  scenario('creates a user', async (scenario) => {
    mockCurrentUser(scenario.user.one)

    const result = await createUser({
      input: { email: 'foo@you.com', name: 'String', action_ids: [9659194] },
    })

    expect(result.email).toEqual('foo@you.com')
    expect(result.name).toEqual('String')
    expect(result.action_ids).toEqual([9659194])
  })

  scenario('updates a user', async (scenario) => {
    mockCurrentUser(scenario.user.one)

    const original = await user({ id: scenario.user.one.id })
    const result = await updateUser({
      id: original.id,
      input: { email: 'foo@you.com' },
    })

    expect(result.email).toEqual('foo@you.com')
  })

  scenario('deletes a user', async (scenario) => {
    mockCurrentUser(scenario.user.one)

    const original = await deleteUser({ id: scenario.user.one.id })
    const result = await user({ id: original.id })

    expect(result).toEqual(null)
  })
})
