import { hotlineLogs, hotlineLog, deleteHotlineLog } from './hotlineLogs'

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

  scenario('deletes a hotlineLog', async (scenario) => {
    const original = await deleteHotlineLog({
      id: scenario.hotlineLog.one.id,
    })
    const result = await hotlineLog({ id: original.id })

    expect(result).toEqual(null)
  })
})
