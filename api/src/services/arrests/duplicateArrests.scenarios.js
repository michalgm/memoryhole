export const standard = defineScenario({
  user: {
    testUser: {
      data: {
        email: 'test@example.com',
        name: 'Test User',
        role: 'Operator',
      },
    },
  },
  action: {
    testAction: {
      data: {
        name: 'Test Action',
        start_date: new Date('2024-01-01'),
      },
    },
  },
  arrest: {
    johnSmith: (scenario) => ({
      data: {
        date: new Date('2024-01-01T10:00:00Z'),
        arrest_city: 'Test City',
        action: { connect: { id: scenario.action.testAction.id } },
        arrestee: {
          create: {
            first_name: 'John',
            last_name: 'Smith',
            email: 'john.smith@email.com',
            phone_1: '555-123-4567',
            dob: new Date('1990-01-01'),
          },
        },
      },
    }),
    jonSmith: (scenario) => ({
      data: {
        date: new Date('2024-01-02T10:00:00Z'),
        arrest_city: 'Test City',
        action: { connect: { id: scenario.action.testAction.id } },
        arrestee: {
          create: {
            first_name: 'Jon', // Similar spelling
            last_name: 'Smith',
            email: 'jon.smith@email.com',
            phone_1: '555-123-4567',
            dob: new Date('1990-01-01'),
          },
        },
      },
    }),
    johnSmyth: (scenario) => ({
      data: {
        date: new Date('2024-01-03T10:00:00Z'),
        arrest_city: 'Test City',
        action: { connect: { id: scenario.action.testAction.id } },
        arrestee: {
          create: {
            first_name: 'John',
            last_name: 'Smyth', // Similar spelling
            email: 'john.smyth@email.com',
            phone_1: '555-987-6543',
            dob: new Date('1990-01-01'),
          },
        },
      },
    }),
    janeDoe: (scenario) => ({
      data: {
        date: new Date('2024-01-04T10:00:00Z'),
        arrest_city: 'Test City',
        action: { connect: { id: scenario.action.testAction.id } },
        arrestee: {
          create: {
            first_name: 'Jane',
            last_name: 'Doe', // Different person
            email: 'jane.doe@email.com',
            phone_1: '555-111-2222',
            dob: new Date('1985-05-15'),
          },
        },
      },
    }),
  },
})

export const withIgnored = defineScenario({
  user: {
    testUser: {
      data: {
        email: 'test@example.com',
        name: 'Test User',
        role: 'Operator',
      },
    },
  },
  action: {
    testAction: {
      data: {
        name: 'Test Action',
        start_date: new Date('2024-01-01'),
      },
    },
  },
  arrest: {
    first: (scenario) => ({
      data: {
        date: new Date('2024-01-01T10:00:00Z'),
        arrest_city: 'Test City',
        action: { connect: { id: scenario.action.testAction.id } },
        arrestee: {
          create: {
            first_name: 'John',
            last_name: 'Smith',
            dob: new Date('1990-01-01'),
          },
        },
      },
    }),
    second: (scenario) => ({
      data: {
        date: new Date('2024-01-01T12:00:00Z'),
        arrest_city: 'Test City',
        action: { connect: { id: scenario.action.testAction.id } },
        arrestee: {
          create: {
            first_name: 'John',
            last_name: 'Smith',
            dob: new Date('1990-01-01'),
          },
        },
      },
    }),
  },
  ignoredDuplicateArrest: {
    ignored: (scenario) => ({
      data: {
        arrest1_id: Math.min(
          scenario.arrest.first.id,
          scenario.arrest.second.id
        ),
        arrest2_id: Math.max(
          scenario.arrest.first.id,
          scenario.arrest.second.id
        ),
        created_by_id: scenario.user.testUser.id,
      },
    }),
  },
})
