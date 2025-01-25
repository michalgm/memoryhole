import {
  bulkUpdateUsers,
  createUser,
  deleteUser,
  updateUser,
  user,
  users,
} from './users'

describe('users', () => {
  // Basic CRUD operations
  describe('basic operations', () => {
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

  // Role hierarchy tests
  describe('role hierarchy', () => {
    scenario(
      'respects role hierarchy for create operations',
      async (scenario) => {
        // Admin can create any role level
        mockCurrentUser(scenario.user.admin)
        const adminCreatesAdmin = await createUser({
          input: {
            email: 'newadmin@example.com',
            name: 'New Admin',
            role: 'Admin',
          },
        })
        expect(adminCreatesAdmin.role).toEqual('Admin')

        // Coordinator can create coordinators and users
        mockCurrentUser(scenario.user.coordinator)
        const coordCreatesCoord = await createUser({
          input: {
            email: 'newcoord@example.com',
            name: 'New Coordinator',
            role: 'Coordinator',
          },
        })
        expect(coordCreatesCoord.role).toEqual('Coordinator')

        const coordCreatesUser = await createUser({
          input: {
            email: 'newuser@example.com',
            name: 'New User',
            role: 'User',
          },
        })
        expect(coordCreatesUser.role).toEqual('User')

        // Coordinator cannot create admin
        await expect(
          createUser({
            input: {
              email: 'noadmin@example.com',
              name: 'Try Admin',
              role: 'Admin',
            },
          })
        ).rejects.toThrow('You cannot assign a role higher than your own')

        // Regular user cannot create any users
        mockCurrentUser(scenario.user.regular)
        await expect(
          createUser({
            input: {
              email: 'nouser@example.com',
              name: 'Try User',
              role: 'User',
            },
          })
        ).rejects.toThrow("You don't have access to do that")
      }
    )

    scenario('respects role hierarchy for updates', async (scenario) => {
      // Admin can update coordinator
      mockCurrentUser(scenario.user.admin)
      const resultAdmin = await updateUser({
        id: scenario.user.coordinator.id,
        input: { name: 'New Name' },
      })
      expect(resultAdmin.name).toEqual('New Name')

      // Coordinator cannot update admin
      mockCurrentUser(scenario.user.coordinator)
      await expect(
        updateUser({
          id: scenario.user.admin.id,
          input: { name: 'New Name' },
        })
      ).rejects.toThrow(
        'You cannot modify users with a role higher than your own'
      )
    })

    scenario('respects role hierarchy for bulk updates', async (scenario) => {
      mockCurrentUser(scenario.user.coordinator)

      // Can bulk update users of same/lower role
      const resultOk = await bulkUpdateUsers({
        ids: [scenario.user.coordinator2.id, scenario.user.regular.id],
        input: { name: 'New Name' },
      })
      expect(resultOk.count).toEqual(2)

      // Cannot bulk update if any user has higher role
      await expect(
        bulkUpdateUsers({
          ids: [scenario.user.admin.id, scenario.user.regular.id],
          input: { name: 'New Name' },
        })
      ).rejects.toThrow(
        'You cannot modify users with a role higher than your own'
      )
    })

    scenario('respects role hierarchy for role updates', async (scenario) => {
      // Admin can change coordinator's role
      mockCurrentUser(scenario.user.admin)
      const resultAdmin = await updateUser({
        id: scenario.user.coordinator.id,
        input: { role: 'User' },
      })
      expect(resultAdmin.role).toEqual('User')

      // Coordinator cannot promote user to admin
      mockCurrentUser(scenario.user.coordinator)
      await expect(
        updateUser({
          id: scenario.user.regular.id,
          input: { role: 'Admin' },
        })
      ).rejects.toThrow('You cannot assign a role higher than your own')

      // Coordinator can promote user to coordinator
      const resultCoord = await updateUser({
        id: scenario.user.regular.id,
        input: { role: 'Coordinator' },
      })
      expect(resultCoord.role).toEqual('Coordinator')
    })

    scenario('respects role hierarchy for deletes', async (scenario) => {
      // Admin can delete coordinator
      mockCurrentUser(scenario.user.admin)
      const deletedCoord = await deleteUser({
        id: scenario.user.coordinator.id,
      })
      const checkCoord = await user({ id: deletedCoord.id })
      expect(checkCoord).toEqual(null)

      // Coordinator cannot delete admin
      mockCurrentUser(scenario.user.coordinator)
      await expect(deleteUser({ id: scenario.user.admin.id })).rejects.toThrow(
        'You cannot delete users with a role higher than your own'
      )

      // Coordinator can delete regular user
      const deletedUser = await deleteUser({ id: scenario.user.regular.id })
      const checkUser = await user({ id: deletedUser.id })
      expect(checkUser).toEqual(null)
    })

    scenario('allows peer-level role operations', async (scenario) => {
      mockCurrentUser(scenario.user.coordinator)

      // Coordinator can update another coordinator
      const resultUpdate = await updateUser({
        id: scenario.user.coordinator2.id,
        input: { name: 'New Name' },
      })
      expect(resultUpdate.name).toEqual('New Name')

      // Coordinator can assign coordinator role to user
      const resultRole = await updateUser({
        id: scenario.user.regular.id,
        input: { role: 'Coordinator' },
      })
      expect(resultRole.role).toEqual('Coordinator')

      // Coordinator can delete another coordinator
      const deletedCoord = await deleteUser({
        id: scenario.user.coordinator2.id,
      })
      const checkDeleted = await user({ id: deletedCoord.id })
      expect(checkDeleted).toEqual(null)

      // Coordinator can create new coordinator
      const resultCreate = await createUser({
        input: {
          email: 'newcoord@example.com',
          name: 'New Coordinator',
          role: 'Coordinator',
        },
      })
      expect(resultCreate.role).toEqual('Coordinator')
    })
  })
})
