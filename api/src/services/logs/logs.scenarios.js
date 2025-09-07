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

export const arrestAccessScenario = defineScenario({
  user: {
    admin: {
      data: {
        name: 'Admin User',
        email: 'admin@example2.com',
      },
    },
    restrictedArrests: {
      data: {
        name: 'Restricted User',
        email: 'restricted@example2.com',
      },
    },
  },
  action: {
    allowed: {
      data: {
        name: 'Allowed Action',
        start_date: new Date('2023-06-01'),
      },
    },
    disallowed: {
      data: {
        name: 'Disallowed Action',
        start_date: new Date('2023-06-01'),
      },
    },
  },
  arrest: {
    allowed: (scenario) => ({
      data: {
        date: '2023-06-15T10:00:00Z',
        action: { connect: { id: scenario.action.allowed.id } },
      },
    }),
    restricted: (scenario) => ({
      data: {
        date: '2024-07-16T10:00:00Z',
        action: { connect: { id: scenario.action.allowed.id } },
      },
    }),
  },
  log: {
    simple: (scenario) => ({
      data: {
        type: 'Email',
        time: '2023-06-20T10:00:00Z',
        action: { connect: { id: scenario.action.allowed.id } },
      },
    }),
    withMultipleArrests: (scenario) => ({
      data: {
        type: 'Email',
        time: '2023-06-20T10:00:00Z',
        action: { connect: { id: scenario.action.allowed.id } },
        arrests: {
          connect: [
            { id: scenario.arrest.allowed.id },
            { id: scenario.arrest.restricted.id },
          ],
        },
      },
    }),
  },
})
