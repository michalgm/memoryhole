import {
  hotlineLogs,
  hotlineLog,
  createHotlineLog,
  updateHotlineLog,
  deleteHotlineLog,
} from './hotlineLogs'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('hotlineLogs', () => {
  scenario('returns all hotlineLogs', async (scenario) => {
    const result = await hotlineLogs()

    expect(result.length).toEqual(Object.keys(scenario.hotlineLog).length)
  })

  scenario('returns a single hotlineLog', async (scenario) => {
    const result = await hotlineLog({ id: scenario.hotlineLog.one.id })

    expect(result).toEqual(scenario.hotlineLog.one)
  })

  scenario('creates a hotlineLog', async (scenario) => {
    mockCurrentUser(scenario.user.one)

    const result = await createHotlineLog({
      input: {
        start_time: '2023-11-08T20:43:16.860Z',
        end_time: '2023-11-08T20:43:16.860Z',
      },
    })

    expect(result.start_time).toEqual(new Date('2023-11-08T20:43:16.860Z'))
    expect(result.end_time).toEqual(new Date('2023-11-08T20:43:16.860Z'))
  })

  scenario('updates a hotlineLog', async (scenario) => {
    mockCurrentUser(scenario.user.one)

    const original = await hotlineLog({
      id: scenario.hotlineLog.one.id,
    })
    const result = await updateHotlineLog({
      id: original.id,
      input: { start_time: '2023-11-09T20:43:16.861Z' },
    })

    expect(result.start_time).toEqual(new Date('2023-11-09T20:43:16.861Z'))
  })

  scenario('deletes a hotlineLog', async (scenario) => {
    mockCurrentUser(scenario.user.one)

    const original = await deleteHotlineLog({
      id: scenario.hotlineLog.one.id,
    })
    const result = await hotlineLog({ id: original.id })

    expect(result).toEqual(null)
  })
})
