import dayjs from 'src/lib/dayjs'
import { db } from 'src/lib/db'

import {
  action,
  Action,
  actions,
  checkActionAccess,
  createAction,
  deleteAction,
  filterActionAccess,
  updateAction,
} from './actions'
// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

const getRelatedRecords = async (actionId) => {
  const arrests = await db.arrest.findMany({
    where: { action_id: actionId },
  })
  const logs = await db.log.findMany({
    where: { action_id: actionId },
  })
  return { arrests, logs }
}

const verifyRecordDeletion = async (
  actionId,
  beforeRecords,
  expectDeleted = true
) => {
  const afterAction = await action({ id: actionId })
  expect(afterAction).toEqual(null)

  const afterArrests = await db.arrest.findMany({
    where: { id: { in: beforeRecords.arrests.map((a) => a.id) } },
  })
  const afterLogs = await db.log.findMany({
    where: { id: { in: beforeRecords.logs.map((l) => l.id) } },
  })

  if (expectDeleted) {
    expect(afterArrests).toEqual([])
    expect(afterLogs).toEqual([])
  } else {
    expect(afterArrests.length).toEqual(beforeRecords.arrests.length)
    expect(afterLogs.length).toEqual(beforeRecords.logs.length)
  }
}

afterEach(async () => {
  // Clean up any test data that might interfere
  jest.useRealTimers()
  jest.restoreAllMocks()
})

describe('actions', () => {
  beforeEach(() => {
    mockCurrentUser({ name: 'Rob' })
  })
  scenario('returns all actions', async (scenario) => {
    const result = await actions()

    expect(result.length).toEqual(Object.keys(scenario.action).length)
  })

  scenario('returns a single action', async (scenario) => {
    const result = await action({ id: scenario.action.one.id })

    expect(result).toEqual(scenario.action.one)
  })

  scenario('creates a action', async () => {
    const startDate = new Date().toISOString()
    const result = await createAction({
      input: { name: 'String', start_date: startDate },
    })

    expect(result.name).toEqual('String')
    expect(result.start_date).toEqual(new Date(startDate))
  })

  scenario('updates a action', async (scenario) => {
    const result = await updateAction({
      id: scenario.action.one.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a action', async (scenario) => {
    const id = scenario.action.one.id
    await deleteAction({ id })
    const result = await action({ id })

    expect(result).toEqual(null)
  })

  scenario('deletes an action with no related records', async (scenario) => {
    const actionId = scenario.action.two.id
    const beforeRecords = await getRelatedRecords(actionId)

    // Verify no relations exist
    expect(beforeRecords.arrests.length).toBe(0)
    expect(beforeRecords.logs.length).toBe(0)

    // Delete should work with either flag value
    await deleteAction({ id: actionId, deleteRelations: true })
    const result = await action({ id: actionId })
    expect(result).toEqual(null)
  })

  // Update existing deletion tests to use helper functions
  scenario(
    'deletes an action without associated records when deleteRelations is false',
    async (scenario) => {
      const actionId = scenario.action.one.id
      const beforeRecords = await getRelatedRecords(actionId)

      expect(beforeRecords.arrests.length).toBeGreaterThan(0)
      expect(beforeRecords.logs.length).toBeGreaterThan(0)

      await deleteAction({ id: actionId, deleteRelations: false })
      await verifyRecordDeletion(actionId, beforeRecords, false)
    }
  )

  scenario(
    'deletes an action and all associated records when deleteRelations is true',
    async (scenario) => {
      const actionId = scenario.action.one.id
      const beforeRecords = await getRelatedRecords(actionId)

      expect(beforeRecords.arrests.length).toBeGreaterThan(0)
      expect(beforeRecords.logs.length).toBeGreaterThan(0)

      await deleteAction({ id: actionId, deleteRelations: true })
      await verifyRecordDeletion(actionId, beforeRecords, true)
    }
  )
})

describe('action access control', () => {
  scenario('filterActionAccess combines date and action filters', () => {
    mockCurrentUser({
      access_date_min: new Date('2023-01-01'),
      access_date_max: new Date('2023-12-31'),
      action_ids: [1, 2],
    })
    const result = filterActionAccess({})
    expect(result.AND).toBeDefined()
    expect(result.id.in).toEqual([1, 2])
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

      const result = await actions()
      expect(result).toEqual([scenario.action.inRange])
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

      const result = await actions()
      expect(result).toEqual([scenario.action.allowed])
    }
  )
})

describe('action date threshold filtering', () => {
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

  test('excludes actions older than threshold', () => {
    const baseWhere = {}
    const result = filterActionAccess(baseWhere)
    const expectedDate = dayjs().subtract(30, 'day').startOf('day')

    expect(result.AND[0].start_date.gte).toBeDefined()
    expect(result.AND[0].start_date.gte.toISOString()).toEqual(
      expectedDate.toISOString()
    )
  })

  test('combines threshold with existing date filters', () => {
    const baseWhere = {
      start_date: { lte: new Date('2023-12-31'), gte: new Date('2023-12-31') },
    }
    const result = filterActionAccess(baseWhere)
    const expectedDate = dayjs().subtract(30, 'day').startOf('day')

    expect(result.AND).toHaveLength(2)
    expect(result.AND[1].start_date.gte.toISOString()).toEqual(
      expectedDate.toISOString()
    )
  })

  test('combines threshold with max date correctly', () => {
    mockCurrentUser({
      access_date_threshold: 30,
      access_date_max: new Date('2024-12-31'),
    })

    const result = filterActionAccess({})
    expect(result.AND).toHaveLength(2)
    const expectedThresholdDate = dayjs().subtract(30, 'day').startOf('day')
    expect(result.AND[1].start_date.gte.toISOString()).toEqual(
      expectedThresholdDate.toISOString()
    )
    expect(result.AND[0].start_date.lte).toEqual(new Date('2024-12-31'))
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

    const result = filterActionAccess({})

    // Should only have max date constraint
    expect(result.AND).toHaveLength(1)
    expect(result.AND[0].start_date.lte).toEqual(new Date('2024-12-31'))
  })
})

describe('checkActionAccess', () => {
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

  test('throws error when action date is before min date', () => {
    mockCurrentUser({
      access_date_min: new Date('2023-01-01'),
    })

    expect(() =>
      checkActionAccess({ start_date: new Date('2022-12-31') })
    ).toThrow('Action start_date')
  })

  test('throws error when action date is after max date', () => {
    mockCurrentUser({
      access_date_max: new Date('2023-12-31'),
    })

    expect(() =>
      checkActionAccess({ start_date: new Date('2024-01-01') })
    ).toThrow('Action start_date')
  })

  test('throws error when action date exceeds threshold', () => {
    mockCurrentUser({
      access_date_threshold: 30,
    })

    const oldDate = dayjs().subtract(31, 'days').toDate()
    expect(() => checkActionAccess({ start_date: oldDate })).toThrow(
      'threshold'
    )
  })

  test('throws error when action id not in allowed list', () => {
    mockCurrentUser({
      action_ids: [1, 2, 3],
    })

    expect(() => checkActionAccess({ id: 4, start_date: new Date() })).toThrow(
      'access to action'
    )
  })

  test('allows access when all conditions are met', () => {
    mockCurrentUser({
      access_date_min: new Date('2023-01-01'),
      access_date_max: new Date('2024-12-31'),
      access_date_threshold: 30,
      action_ids: [1],
    })

    const validAction = {
      id: 1,
      start_date: new Date('2024-11-15'),
    }

    expect(() => checkActionAccess(validAction)).not.toThrow()
  })
})

describe('action access with arrest restrictions', () => {
  scenario(
    'arrestAccessScenario',
    'filters out restricted arrests from action',
    async (scenario) => {
      // User has access to actions but restricted arrests
      mockCurrentUser({
        id: scenario.user.restrictedArrests.id,
        access_date_min: new Date('2023-01-01'),
        access_date_max: new Date('2023-06-30'),
        action_ids: [scenario.action.withMultipleArrests.id],
      })

      const result = await action({
        id: scenario.action.withMultipleArrests.id,
      })
      const arrests = await Action.Arrest(null, {
        root: { id: result.id },
      })

      // Should return the action but with filtered arrests
      expect(result).toBeDefined()
      expect(result.id).toEqual(scenario.action.withMultipleArrests.id)
      expect(arrests).toHaveLength(1)
      expect(arrests[0].id).toEqual(scenario.arrest.allowed.id)
      // Should not include the restricted arrest
      expect(
        arrests.find((a) => a.id === scenario.arrest.restricted.id)
      ).toBeUndefined()
    }
  )
})

describe('Action resolvers', () => {
  scenario(
    'arrestAccessScenario',
    'Arrest resolver respects access control',
    async (scenario) => {
      mockCurrentUser({
        id: scenario.user.restrictedArrests.id,
        access_date_min: new Date('2023-01-01'),
        access_date_max: new Date('2023-06-30'),
      })

      const arrests = await Action.Arrest(null, {
        root: { id: scenario.action.withMultipleArrests.id },
      })

      expect(arrests).toHaveLength(1)
      expect(arrests[0].id).toEqual(scenario.arrest.allowed.id)
    }
  )
})
