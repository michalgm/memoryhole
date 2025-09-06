export const standard = defineScenario({
  log: {
    one: {
      data: {
        time: new Date('2023-02-26'),
        type: 'Phone Call',
        notes: 'This is a test log',
      },
    },
    two: {
      data: {
        time: new Date('2023-02-26'),
        type: 'In Person',
        notes: 'This is another test log',
      },
    },
  },
})
export const accessScenario = defineScenario({
  user: {
    admin: {
      data: { email: 'adminAccess@example.com', name: 'Access Admin' },
    },
    restricted: {
      data: {
        email: 'restrictedAccess@example.com',
        name: 'Access Restricted',
      },
    },
  },
  action: {
    allowed: {
      data: { name: 'Allowed Action', start_date: new Date('2023-06-01') },
    },
    restricted: {
      data: {
        name: 'Restricted Action',
        start_date: new Date('2023-06-01'),
      },
    },
  },
  log: {
    inRange: (scenario) => ({
      data: {
        notes: 'In Range',
        time: new Date('2023-06-01'),
        type: 'Phone Call',
        action: { connect: { id: scenario.action.allowed.id } },
      },
    }),
    outOfRange: (scenario) => ({
      data: {
        notes: 'Out of Range',
        time: new Date('2022-12-31'),
        type: 'Phone Call',
        action: { connect: { id: scenario.action.restricted.id } },
      },
    }),
  },
})
