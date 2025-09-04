import { db } from 'src/lib/db'

import { mergeArrests, updateArrest } from './arrests'

describe('mergeArrests', () => {
  scenario('mergeScenario', 'merges arrests successfully', async (scenario) => {
    mockCurrentUser({ name: 'Rob', id: scenario.user.admin.id })
    const mergeResult = await mergeArrests({
      id: scenario.arrest.one.id,
      input: { jurisdiction: 'Updated City' },
      merge_id: scenario.arrest.two.id,
    })

    // Verify the target arrest was updated
    expect(mergeResult.jurisdiction).toEqual('Updated City')
    expect(mergeResult.id).toEqual(scenario.arrest.one.id)

    // Verify the merged arrest was deleted
    const deletedArrest = await db.arrest.findUnique({
      where: { id: scenario.arrest.two.id },
    })
    expect(deletedArrest).toBeNull()
  })

  scenario(
    'mergeScenario',
    'moves logs from merged arrest to target arrest',
    async (scenario) => {
      mockCurrentUser({ name: 'Rob', id: scenario.user.admin.id })

      // Create logs connected to the arrest that will be merged
      const log1 = await db.log.create({
        data: {
          time: new Date(),
          type: 'test',
          notes: 'Test log 1',
          arrests: {
            connect: { id: scenario.arrest.two.id },
          },
        },
      })

      const log2 = await db.log.create({
        data: {
          time: new Date(),
          type: 'test',
          notes: 'Test log 2',
          arrests: {
            connect: { id: scenario.arrest.two.id },
          },
        },
      })

      // Perform merge
      await mergeArrests({
        id: scenario.arrest.one.id,
        input: {},
        merge_id: scenario.arrest.two.id,
      })

      // Verify logs are now connected to the target arrest
      const targetArrestLogs = await db.log.findMany({
        where: {
          arrests: {
            some: { id: scenario.arrest.one.id },
          },
        },
      })

      expect(targetArrestLogs).toHaveLength(2)
      expect(targetArrestLogs.map((l) => l.id)).toContain(log1.id)
      expect(targetArrestLogs.map((l) => l.id)).toContain(log2.id)

      // Verify logs are no longer connected to the deleted arrest
      const deletedArrestLogs = await db.log.findMany({
        where: {
          arrests: {
            some: { id: scenario.arrest.two.id },
          },
        },
      })

      expect(deletedArrestLogs).toHaveLength(0)
    }
  )

  scenario(
    'mergeScenario',
    'preserves logs connected to multiple arrests',
    async (scenario) => {
      mockCurrentUser({ name: 'Rob', id: scenario.user.admin.id })

      // Create a third arrest for testing
      const thirdArrest = await db.arrest.create({
        data: {
          display_field: 'Test',
          search_field: 'Test',
          jurisdiction: 'Test City',
          date: new Date('2023-03-01'),
          arrestee_id: scenario.arrest.one.arrestee_id,
          action_id: scenario.action.one.id,
          created_by_id: scenario.user.admin.id,
        },
      })

      // Create a log connected to both the merge target and a third arrest
      const sharedLog = await db.log.create({
        data: {
          time: new Date(),
          type: 'shared',
          notes: 'Shared log',
          arrests: {
            connect: [
              { id: scenario.arrest.two.id }, // Will be merged
              { id: thirdArrest.id }, // Should remain connected
            ],
          },
        },
      })

      // Perform merge
      await mergeArrests({
        id: scenario.arrest.one.id,
        input: {},
        merge_id: scenario.arrest.two.id,
      })

      // Verify the log is now connected to both target and third arrest
      const logConnections = await db.log.findUnique({
        where: { id: sharedLog.id },
        include: { arrests: true },
      })

      const arrestIds = logConnections.arrests.map((a) => a.id)
      expect(arrestIds).toContain(scenario.arrest.one.id) // Connected to target
      expect(arrestIds).toContain(thirdArrest.id) // Still connected to third
      expect(arrestIds).not.toContain(scenario.arrest.two.id) // No longer connected to deleted
    }
  )

  scenario(
    'mergeScenario',
    'merges custom fields from both arrests',
    async (scenario) => {
      mockCurrentUser({ name: 'Rob', id: scenario.user.admin.id })

      // Set up custom fields on both arrests
      await updateArrest({
        id: scenario.arrest.one.id,
        input: { custom_fields: { existing: 'value', shared: 'original' } },
      })

      await updateArrest({
        id: scenario.arrest.two.id,
        input: { custom_fields: { new: 'merged', shared: 'updated' } },
      })

      // Merge with additional custom fields in input
      const result = await mergeArrests({
        id: scenario.arrest.one.id,
        input: {
          custom_fields: {
            shared: 'from_input',
            input_only: 'value',
          },
        },
        merge_id: scenario.arrest.two.id,
      })

      // The input should take precedence in the merge
      expect(result.custom_fields).toMatchObject({
        existing: 'value', // From target arrest
        shared: 'from_input', // From input (takes precedence)
        input_only: 'value', // From input
      })
    }
  )

  scenario(
    'mergeScenario',
    'handles merge when target arrest has logs',
    async (scenario) => {
      mockCurrentUser({ name: 'Rob', id: scenario.user.admin.id })

      // Create logs on both arrests
      const targetLog = await db.log.create({
        data: {
          time: new Date(),
          type: 'target',
          notes: 'Target log',
          arrests: {
            connect: { id: scenario.arrest.one.id },
          },
        },
      })

      const mergeLog = await db.log.create({
        data: {
          time: new Date(),
          type: 'merge',
          notes: 'Merge log',
          arrests: {
            connect: { id: scenario.arrest.two.id },
          },
        },
      })

      // Perform merge
      await mergeArrests({
        id: scenario.arrest.one.id,
        input: {},
        merge_id: scenario.arrest.two.id,
      })

      // Verify both logs are now connected to the target arrest
      const targetArrestLogs = await db.log.findMany({
        where: {
          arrests: {
            some: { id: scenario.arrest.one.id },
          },
        },
        orderBy: { id: 'asc' },
      })

      expect(targetArrestLogs).toHaveLength(2)
      expect(targetArrestLogs.map((l) => l.id)).toContain(targetLog.id)
      expect(targetArrestLogs.map((l) => l.id)).toContain(mergeLog.id)
    }
  )

  scenario(
    'mergeScenario',
    'deletes merged arrest arrestee',
    async (scenario) => {
      mockCurrentUser({ name: 'Rob', id: scenario.user.admin.id })

      const mergedArresteeId = scenario.arrest.two.arrestee_id

      await mergeArrests({
        id: scenario.arrest.one.id,
        input: {},
        merge_id: scenario.arrest.two.id,
      })

      // Verify the merged arrest's arrestee was deleted
      const deletedArrestee = await db.arrestee.findUnique({
        where: { id: mergedArresteeId },
      })
      expect(deletedArrestee).toBeNull()

      // Verify the target arrest's arrestee still exists
      const targetArrestee = await db.arrestee.findUnique({
        where: { id: scenario.arrest.one.arrestee_id },
      })
      expect(targetArrestee).toBeDefined()
    }
  )

  scenario(
    'mergeScenario',
    'enforces access control on both arrests',
    async (scenario) => {
      mockCurrentUser({
        name: 'Rob',
        id: scenario.user.admin.id,
        action_ids: [scenario.action.one.id], // Only allow access to action.one
      })

      // Create an arrest with a different action
      const restrictedArrest = await db.arrest.create({
        data: {
          display_field: 'Restricted',
          search_field: 'Restricted',
          jurisdiction: 'Restricted City',
          date: new Date('2023-03-01'),
          arrestee_id: scenario.arrest.one.arrestee_id,
          action_id: scenario.action.two.id, // Different action
          created_by_id: scenario.user.admin.id,
        },
      })

      // Should throw access error when trying to merge restricted arrest
      await expect(
        mergeArrests({
          id: scenario.arrest.one.id,
          input: {},
          merge_id: restrictedArrest.id,
        })
      ).rejects.toThrow('access to arrest')
    }
  )

  scenario('mergeScenario', 'handles merge with no logs', async (scenario) => {
    mockCurrentUser({ name: 'Rob', id: scenario.user.admin.id })

    // Perform merge when neither arrest has logs
    const result = await mergeArrests({
      id: scenario.arrest.one.id,
      input: { jurisdiction: 'No Logs City' },
      merge_id: scenario.arrest.two.id,
    })

    expect(result.jurisdiction).toEqual('No Logs City')

    // Verify merge completed successfully
    const deletedArrest = await db.arrest.findUnique({
      where: { id: scenario.arrest.two.id },
    })
    expect(deletedArrest).toBeNull()
  })

  scenario(
    'mergeScenario',
    'maintains transaction integrity on failure',
    async (scenario) => {
      mockCurrentUser({ name: 'Rob', id: scenario.user.admin.id })

      // Attempt merge and expect it to fail
      await expect(
        mergeArrests({
          id: scenario.arrest.one.id,
          input: { jurisdiction: 'Updated City' },
          merge_id: 99999, // Non-existent ID
        })
      ).rejects.toThrow()

      // Verify both arrests still exist (transaction rolled back)
      const targetArrest = await db.arrest.findUnique({
        where: { id: scenario.arrest.one.id },
      })
      const mergeArrest = await db.arrest.findUnique({
        where: { id: scenario.arrest.two.id },
      })

      expect(targetArrest).toBeDefined()
      expect(mergeArrest).toBeDefined()
    }
  )
})
