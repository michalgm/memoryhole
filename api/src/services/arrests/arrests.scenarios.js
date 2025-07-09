export const standard = defineScenario({
  arrest: {
    one: {
      data: {
        display_field: 'String',
        search_field: 'String',
        date: new Date('2023-02-26'),
        jurisdiction: 'Alameda',
        custom_fields: {
          test: true,
          custom: 'yes',
        },

        arrestee: {
          create: {
            first_name: 'Test',
            custom_fields: {
              test: true,
              custom: 'yes',
            },
          },
        },
      },
    },
    two: {
      data: {
        display_field: 'String',
        search_field: 'String',
        date: new Date('2023-02-26'),
        jurisdiction: 'Alameda',
        arrestee: {
          create: {
            custom_fields: {
              test: true,
              custom: 'yes',
            },
          },
        },
      },
    },
  },
  user: {
    test: {
      // id: 1,
      data: {
        id: 1,
        name: 'Greg',
        email: 'foo2@bar.com',
      },
    },
  },
})

export const accessScenario = defineScenario({
  user: {
    admin: {
      data: { email: 'admin@example.com', name: 'Admin' },
    },
    restricted: {
      data: { email: 'restricted@example.com', name: 'Restricted' },
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
  arrest: {
    inRange: (scenario) => ({
      data: {
        display_field: 'In Range',
        date: new Date('2023-06-01'),
        jurisdiction: 'Alameda',
        action: { connect: { id: scenario.action.allowed.id } },
      },
    }),
    outOfRange: (scenario) => ({
      data: {
        display_field: 'Out of Range',
        date: new Date('2022-12-31'),
        jurisdiction: 'Alameda',
        action: { connect: { id: scenario.action.restricted.id } },
      },
    }),
  },
})

export const deleteScenario = defineScenario({
  arrest: {
    withArrestee: {
      data: {
        date: '2024-01-01T12:00:00Z',
        arrestee: {
          create: {
            first_name: 'Test',
            last_name: 'Person',
          },
        },
      },
    },
    withoutArrestee: {
      data: {
        date: '2024-01-01T12:00:00Z',
      },
    },
  },
})
