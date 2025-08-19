export const standard = defineScenario({
  user: {
    one: {
      data: {
        role: 'Admin',
        email: 'String1194500',
        name: 'Admin',
        action_ids: [9644249],
      },
    },
    two: {
      data: {
        email: 'String1990009',
        name: 'String',
        action_ids: [7489374],
      },
    },
    admin: {
      data: {
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'Admin',
      },
    },
    coordinator: {
      data: {
        email: 'coord1@example.com',
        name: 'Coordinator One',
        role: 'Coordinator',
      },
    },
    coordinator2: {
      data: {
        email: 'coord2@example.com',
        name: 'Coordinator Two',
        role: 'Coordinator',
      },
    },
    regular: {
      data: {
        email: 'user@example.com',
        name: 'Regular User',
        role: 'Operator',
      },
    },
  },
})
