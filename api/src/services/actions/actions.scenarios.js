export const standard = defineScenario({
  action: {
    one: {
      data: {
        name: 'Action 1',
        start_date: '2024-11-05T10:43:41.129Z',
        Arrest: {
          create: {
            arrestee: {
              create: {
                first_name: 'String',
                last_name: 'String',
                email: 'String',
              },
            },
            date: '2024-11-05T10:43:41.129Z',
          },
        },
        Log: {
          create: {
            type: 'String',
            notes: 'String',
            needs_followup: true,
          },
        },
      },
    },
    two: { data: { name: 'Action 2', start_date: '2024-11-05T10:43:41.129Z' } },
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
    inRange: {
      data: { name: 'In Range Action', start_date: new Date('2023-06-01') },
    },
    outOfRange: {
      data: {
        name: 'Out of Range Action',
        start_date: new Date('2022-12-31'),
      },
    },
    allowed: {
      data: { name: 'Allowed Action', start_date: new Date('2022-06-01') },
    },
    restricted: {
      data: {
        name: 'Restricted Action',
        start_date: new Date('2022-06-01'),
      },
    },
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
    simple: {
      data: {
        name: 'Simple Action',
        start_date: new Date('2023-06-01'),
      },
    },
    withMultipleArrests: {
      data: {
        name: 'Action with Multiple Arrests',
        start_date: new Date('2023-06-01'),
      },
    },
  },
  arrest: {
    allowed: (scenario) => ({
      data: {
        date: '2023-06-15T10:00:00Z',
        action: { connect: { id: scenario.action.withMultipleArrests.id } },
      },
    }),
    restricted: (scenario) => ({
      data: {
        date: '2024-07-16T10:00:00Z',
        action: { connect: { id: scenario.action.withMultipleArrests.id } },
      },
    }),
  },
})
