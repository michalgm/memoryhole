import dayjs from 'src/lib/dayjs'

import {
  checkLogAccess,
  deleteLog,
  filterLogAccess,
  Log,
  log,
  logs,
  updateLog,
} from './logs'
// jest.setTimeout(10000)
// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

afterEach(async () => {
  // Clean up any test data that might interfere
  jest.useRealTimers()
  jest.restoreAllMocks()
})

describe('logs', () => {
  scenario('returns all logs', async (scenario) => {
    mockCurrentUser({ name: 'Rob' })
    const result = await logs()

    expect(result.length).toEqual(Object.keys(scenario.log).length)
  })

  scenario('returns a single log', async (scenario) => {
    mockCurrentUser({ name: 'Rob' })

    const result = await log({ id: scenario.log.one.id })

    expect(result).toEqual(scenario.log.one)
  })

  scenario('deletes a log', async (scenario) => {
    mockCurrentUser({ name: 'Rob' })

    const original = await deleteLog({ id: scenario.log.one.id })
    const result = await log({ id: original.id })

    expect(result).toEqual(null)
  })
})

describe('log access control', () => {
  scenario('filterLogAccess combines date and action filters', () => {
    mockCurrentUser({
      access_date_min: new Date('2023-01-01'),
      access_date_max: new Date('2023-12-31'),
      action_ids: [1, 2],
    })
    const result = filterLogAccess({})
    expect(result.AND).toBeDefined()
    expect(result.action_id.in).toEqual([1, 2])
  })

  scenario(
    'accessScenario',
    'enforces date range restrictions',
    async (scenario) => {
      mockCurrentUser({
        id: scenario.user.admin.id,
        access_date_min: new Date('2023-01-01'),
        access_date_max: new Date('2023-12-31'),
      })

      const result = await logs()
      expect(result).toEqual([scenario.log.inRange])
    }
  )

  scenario(
    'accessScenario',
    'enforces action restrictions',
    async (scenario) => {
      mockCurrentUser({
        id: scenario.user.restricted.id,
        action_ids: [scenario.action.allowed.id],
      })

      const result = await logs()
      expect(result).toEqual([scenario.log.inRange])
    }
  )
})

describe('log date threshold filtering', () => {
  const mockDate = new Date('2024-11-30T08:00:00.000Z')

  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(mockDate)
    mockCurrentUser({
      access_date_threshold: 30, // 30 days threshold
    })
    jest.spyOn(require('src/lib/settingsCache'), 'getSetting').mockReturnValue({
      access_date_threshold: true,
      access_date_max: true,
      access_date_min: true,
    })
  })

  test('excludes logs older than threshold', () => {
    const baseWhere = {}
    const result = filterLogAccess(baseWhere)
    const expectedDate = dayjs().subtract(30, 'day').startOf('day')

    expect(result.AND[0].time.gte).toBeDefined()
    expect(result.AND[0].time.gte.toISOString()).toEqual(
      expectedDate.toISOString()
    )
  })

  test('combines threshold with existing date filters', () => {
    const baseWhere = {
      time: { lte: new Date('2023-12-31'), gte: new Date('2023-12-31') },
    }
    const result = filterLogAccess(baseWhere)
    const expectedDate = dayjs().subtract(30, 'day').startOf('day')

    expect(result.AND).toHaveLength(2)
    expect(result.AND[1].time.gte.toISOString()).toEqual(
      expectedDate.toISOString()
    )
  })

  test('combines threshold with max date correctly', () => {
    mockCurrentUser({
      access_date_threshold: 30,
      access_date_max: new Date('2024-12-31'),
    })

    const result = filterLogAccess({})
    expect(result.AND).toHaveLength(2)
    const expectedThresholdDate = dayjs().subtract(30, 'day').startOf('day')
    expect(result.AND[1].time.gte.toISOString()).toEqual(
      expectedThresholdDate.toISOString()
    )
    expect(result.AND[0].time.lte).toEqual(new Date('2024-12-31'))
  })
  test('does not apply threshold when setting is disabled', () => {
    require('src/lib/settingsCache').getSetting.mockReturnValue({
      access_date_threshold: false,
      access_date_max: true,
    })

    mockCurrentUser({
      access_date_threshold: 30,
      access_date_max: new Date('2024-12-31'),
    })

    const result = filterLogAccess({})

    // Should only have max date constraint
    expect(result.AND).toHaveLength(1)
    expect(result.AND[0].time.lte).toEqual(new Date('2024-12-31'))
  })
})

describe('checkLogAccess', () => {
  const mockDate = new Date('2024-11-30T08:00:00.000Z')

  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(mockDate)
    jest.spyOn(require('src/lib/settingsCache'), 'getSetting').mockReturnValue({
      access_date_threshold: true,
      access_date_max: true,
      access_date_min: true,
    })
  })

  // afterEach(() => {
  //   jest.useRealTimers() // Reset timers after test
  // })

  test('throws error when log date is before min date', () => {
    mockCurrentUser({
      access_date_min: new Date('2023-01-01'),
    })

    expect(() => checkLogAccess({ time: new Date('2022-12-31') })).toThrow(
      'Log time'
    )
  })

  test('throws error when arrest date is after max date', () => {
    mockCurrentUser({
      access_date_max: new Date('2023-12-31'),
    })

    expect(() => checkLogAccess({ time: new Date('2024-01-01') })).toThrow(
      'Log time'
    )
  })

  test('throws error when arrest date exceeds threshold', () => {
    mockCurrentUser({
      access_date_threshold: 30,
    })

    const oldDate = dayjs().subtract(31, 'days').toDate()
    expect(() => checkLogAccess({ time: oldDate })).toThrow('threshold')
  })

  test('throws error when action_id not in allowed list', () => {
    mockCurrentUser({
      action_ids: [1, 2, 3],
    })

    expect(() => checkLogAccess({ action_id: 4, time: new Date() })).toThrow(
      'access to log'
    )
  })

  test('allows access when all conditions are met', () => {
    mockCurrentUser({
      access_date_min: new Date('2023-01-01'),
      access_date_max: new Date('2024-12-31'),
      access_date_threshold: 30,
      action_ids: [1],
    })

    const validLog = {
      id: 1,
      time: new Date('2024-11-15'),
      action_id: 1,
    }

    expect(() => checkLogAccess(validLog)).not.toThrow()
    // jest.useRealTimers() // Reset timers after test
  })
})

describe('log access with arrest restrictions', () => {
  scenario(
    'arrestAccessScenario',
    'filters out restricted arrests from log',
    async (scenario) => {
      // User has access to logs but restricted arrests
      mockCurrentUser({
        id: scenario.user.restrictedArrests.id,
        access_date_min: new Date('2023-01-01'),
        access_date_max: new Date('2023-06-30'),
        action_ids: [scenario.action.allowed.id],
      })

      const result = await log({ id: scenario.log.withMultipleArrests.id })
      const arrests = await Log.arrests(null, {
        root: { id: result.id },
      })

      // Should return the log but with filtered arrests
      expect(result).toBeDefined()
      expect(result.id).toEqual(scenario.log.withMultipleArrests.id)
      expect(arrests).toHaveLength(1)
      expect(arrests[0].id).toEqual(scenario.arrest.allowed.id)
      // Should not include the restricted arrest
      expect(
        arrests.find((a) => a.id === scenario.arrest.restricted.id)
      ).toBeUndefined()
    }
  )
  scenario(
    'arrestAccessScenario',
    'prevents user from updating arrests on logs with restricted arrests',
    async (scenario) => {
      // User has limited arrest access
      mockCurrentUser({
        id: scenario.user.restrictedArrests.id,
        access_date_min: new Date('2023-01-01'),
        access_date_max: new Date('2023-06-30'),
        action_ids: [scenario.action.allowed.id],
      })

      // Get the original log with filtered arrests
      const originalArrests = await Log.arrests(null, {
        root: { id: scenario.log.withMultipleArrests.id },
      })
      expect(originalArrests).toHaveLength(1) // User sees only one arrest
      // User updates the log (should preserve hidden arrests)
      await expect(
        updateLog({
          id: scenario.log.withMultipleArrests.id,
          input: {
            notes: 'Updated notes',
            // User passes back the arrests they can see
            arrests: originalArrests.map((a) => a.id),
          },
        })
      ).rejects.toThrow('Cannot update arrests')
    }
  )

  scenario(
    'arrestAccessScenario',
    'prevents user from adding restricted arrests to log',
    async (scenario) => {
      mockCurrentUser({
        id: scenario.user.restrictedArrests.id,
        access_date_min: new Date('2023-01-01'),
        access_date_max: new Date('2023-06-30'),
        action_ids: [scenario.action.allowed.id],
      })

      // User tries to add an arrest they don't have access to
      await expect(
        updateLog({
          id: scenario.log.simple.id,
          input: {
            arrests: [scenario.arrest.restricted.id],
          },
        })
      ).rejects.toThrow('access to arrest')
    }
  )
})

describe('Log resolvers', () => {
  scenario(
    'arrestAccessScenario',
    'arrests resolver respects access control',
    async (scenario) => {
      mockCurrentUser({
        id: scenario.user.restrictedArrests.id,
        access_date_min: new Date('2023-01-01'),
        access_date_max: new Date('2023-06-30'),
      })

      const arrests = await Log.arrests(null, {
        root: { id: scenario.log.withMultipleArrests.id },
      })

      expect(arrests).toHaveLength(1)
      expect(arrests[0].id).toEqual(scenario.arrest.allowed.id)
    }
  )
})
