import { db } from 'src/lib/db'

import {
  action,
  actions,
  createAction,
  deleteAction,
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
