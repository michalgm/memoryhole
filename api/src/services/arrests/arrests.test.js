import { db } from 'src/lib/db'

import {
  arrest,
  arrests,
  bulkDeleteArrests,
  createArrest,
  deleteArrest,
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
