import dayjs from 'dayjs'

import { db } from 'src/lib/db'

import {
  arrest,
  arrests,
  bulkDeleteArrests,
  checkArrestAccess,
  createArrest,
  deleteArrest,
  filterArrestAccess,
  updateArrest,
} from './arrests'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('arrests', () => {
  scenario('returns all arrests', async (scenario) => {
    mockCurrentUser({ name: 'Rob' })

    const result = await arrests()

    expect(result.length).toEqual(Object.keys(scenario.arrest).length)
  })

  scenario('returns a single arrest', async (scenario) => {
    mockCurrentUser({ name: 'Rob' })

    const result = await arrest({ id: scenario.arrest.one.id })

    expect(result).toEqual(scenario.arrest.one)
  })

  scenario('creates a arrest', async () => {
    mockCurrentUser({ name: 'Rob', id: 1 })

    const result = await createArrest({
      input: {
        display_field: 'String',
        search_field: 'String',
        jurisdiction: 'String',
        date: new Date('2023-02-26'),
      },
    })

    expect(result.display_field).toEqual('String')
    expect(result.search_field).toEqual('String')
  })

  scenario('updates a arrest', async (scenario) => {
    mockCurrentUser({ name: 'Rob', id: 1 })

    const original = await arrest({ id: scenario.arrest.one.id })
    const result = await updateArrest({
      id: original.id,
      input: { display_field: 'String2' },
    })

    expect(result.display_field).toEqual('String2')
  })

  scenario('updates a custom field', async (scenario) => {
    mockCurrentUser({ name: 'Rob', id: 1 })
    const original = await arrest({ id: scenario.arrest.one.id })
    await updateArrest({
      id: original.id,
      input: { custom_fields: { foo: 'bar', bar: 'baz' } },
    })
    const result = await updateArrest({
      id: original.id,
      input: { custom_fields: { foo: 'baz' } },
    })
    // const result = await arrest({ id: original.id })
    // console.log('RESULT', result)

    expect(result.custom_fields).toEqual({
      foo: 'baz',
      bar: 'baz',
      test: true,
      custom: 'yes',
    })
  })

  scenario('updates an arrestee custom field', async (scenario) => {
    mockCurrentUser({ name: 'Rob', id: 1 })
    const original = await arrest({ id: scenario.arrest.one.id })
    await updateArrest({
      id: original.id,
      input: { arrestee: { custom_fields: { foo: 'bar', bar: 'baz' } } },
    })

    await updateArrest({
      id: original.id,
      input: { arrestee: { custom_fields: { foo: 'baz' } } },
    })

    const result = await db.arrestee.findUnique({
      where: { id: scenario.arrest.one.arrestee_id },
    })

    expect(result.custom_fields).toEqual({
      bar: 'baz',
      foo: 'baz',
      custom: 'yes',
      test: true,
    })
  })

  scenario('deletes a arrest', async (scenario) => {
    mockCurrentUser({ name: 'Rob' })

    const original = await deleteArrest({
      id: scenario.arrest.one.id,
    })
    const result = await arrest({ id: original.id })

    expect(result).toEqual(null)
  })
})

describe('arrest access controls', () => {
  scenario(
    'accessScenario',
    'enforces date range restrictions',
    async (scenario) => {
      mockCurrentUser({
        id: scenario.user.admin.id,
        arrest_date_min: new Date('2023-01-01'),
        arrest_date_max: new Date('2023-12-31'),
      })

      const result = await arrests()
      expect(result).toEqual([scenario.arrest.inRange])
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

      const result = await arrests()
      expect(result).toEqual([scenario.arrest.inRange])
    }
  )
})

describe('arrest deletion', () => {
  scenario(
    'deleteScenario',
    'deletes a single arrest and its arrestee',
    async (scenario) => {
      mockCurrentUser({ name: 'Rob' })

      const arrest = await deleteArrest({ id: scenario.arrest.withArrestee.id })

      // Verify arrest is deleted
      const deletedArrest = await db.arrest.findUnique({
        where: { id: arrest.id },
      })
      expect(deletedArrest).toBeNull()

      // Verify arrestee is deleted
      const deletedArrestee = await db.arrestee.findUnique({
        where: { id: scenario.arrest.withArrestee.arrestee_id },
      })
      expect(deletedArrestee).toBeNull()
    }
  )

  scenario(
    'deleteScenario',
    'bulk deletes arrests and their arrestees',
    async (scenario) => {
      mockCurrentUser({ name: 'Rob' })

      const ids = [
        scenario.arrest.withArrestee.id,
        scenario.arrest.withoutArrestee.id,
      ]

      const result = await bulkDeleteArrests({ ids })
      expect(result.count).toBe(2)

      // Verify arrests are deleted
      const remainingArrests = await db.arrest.findMany({
        where: { id: { in: ids } },
      })
      expect(remainingArrests).toHaveLength(0)

      // Verify arrestee is deleted
      const remainingArrestee = await db.arrestee.findUnique({
        where: { id: scenario.arrest.withArrestee.arrestee_id },
      })
      expect(remainingArrestee).toBeNull()
    }
  )
})

describe('arrest date threshold filtering', () => {
  const mockDate = new Date('2024-11-30T08:00:00.000Z')

  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(mockDate)
    mockCurrentUser({
      arrest_date_threshold: 30, // 30 days threshold
    })
    jest.spyOn(require('src/lib/settingsCache'), 'getSetting').mockReturnValue({
      arrest_date_threshold: true,
      arrest_date_max: true,
      arrest_date_min: true,
    })
  })

  test('excludes arrests older than threshold', () => {
    const baseWhere = {}
    const result = filterArrestAccess(baseWhere)
    const expectedDate = dayjs().subtract(30, 'day').startOf('day')

    expect(result.AND[0].date.gte).toBeDefined()
    expect(result.AND[0].date.gte.toISOString()).toEqual(
      expectedDate.toISOString()
    )
  })

  test('combines threshold with existing date filters', () => {
    const baseWhere = {
      date: { lte: new Date('2023-12-31'), gte: new Date('2023-12-31') },
    }
    const result = filterArrestAccess(baseWhere)
    const expectedDate = dayjs().subtract(30, 'day').startOf('day')

    expect(result.AND).toHaveLength(2)
    expect(result.AND[1].date.gte.toISOString()).toEqual(
      expectedDate.toISOString()
    )
  })

  test('combines threshold with max date correctly', () => {
    mockCurrentUser({
      arrest_date_threshold: 30,
      arrest_date_max: new Date('2024-12-31'),
    })

    const result = filterArrestAccess({})
    expect(result.AND).toHaveLength(2)
    const expectedThresholdDate = dayjs().subtract(30, 'day').startOf('day')
    expect(result.AND[1].date.gte.toISOString()).toEqual(
      expectedThresholdDate.toISOString()
    )
    expect(result.AND[0].date.lte).toEqual(new Date('2024-12-31'))
  })
  test('does not apply threshold when setting is disabled', () => {
    require('src/lib/settingsCache').getSetting.mockReturnValue({
      arrest_date_threshold: false,
      arrest_date_max: true,
    })

    mockCurrentUser({
      arrest_date_threshold: 30,
      arrest_date_max: new Date('2024-12-31'),
    })

    const result = filterArrestAccess({})

    // Should only have max date constraint
    expect(result.AND).toHaveLength(1)
    expect(result.AND[0].date.lte).toEqual(new Date('2024-12-31'))
  })
})

describe('checkArrestAccess', () => {
  const mockDate = new Date('2024-11-30T08:00:00.000Z')

  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(mockDate)
    jest.spyOn(require('src/lib/settingsCache'), 'getSetting').mockReturnValue({
      arrest_date_threshold: true,
      arrest_date_max: true,
      arrest_date_min: true,
    })
  })

  // afterEach(() => {
  //   jest.useRealTimers() // Reset timers after test
  // })

  test('throws error when arrest date is before min date', () => {
    mockCurrentUser({
      arrest_date_min: new Date('2023-01-01'),
    })

    expect(() => checkArrestAccess({ date: new Date('2022-12-31') })).toThrow(
      'Arrest date'
    )
  })

  test('throws error when arrest date is after max date', () => {
    mockCurrentUser({
      arrest_date_max: new Date('2023-12-31'),
    })

    expect(() => checkArrestAccess({ date: new Date('2024-01-01') })).toThrow(
      'Arrest date'
    )
  })

  test('throws error when arrest date exceeds threshold', () => {
    mockCurrentUser({
      arrest_date_threshold: 30,
    })

    const oldDate = dayjs().subtract(31, 'days').toDate()
    expect(() => checkArrestAccess({ date: oldDate })).toThrow('threshold')
  })

  test('throws error when action_id not in allowed list', () => {
    mockCurrentUser({
      action_ids: [1, 2, 3],
    })

    expect(() => checkArrestAccess({ id: 1, action_id: 4 })).toThrow(
      'access to arrest'
    )
  })

  test('allows access when all conditions are met', () => {
    mockCurrentUser({
      arrest_date_min: new Date('2023-01-01'),
      arrest_date_max: new Date('2024-12-31'),
      arrest_date_threshold: 30,
      action_ids: [1],
    })

    const validArrest = {
      id: 1,
      date: new Date('2024-11-15'),
      action_id: 1,
    }

    expect(() => checkArrestAccess(validArrest)).not.toThrow()
    // jest.useRealTimers() // Reset timers after test
  })
})
