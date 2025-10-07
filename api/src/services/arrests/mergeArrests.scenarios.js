// Add to arrests.scenarios.js
export const mergeScenario = defineScenario({
  user: {
    admin: {
      data: {
        email: 'merge-admin1@example.com',
        name: 'Merge Admin User',
        role: 'Admin',
      },
    },
    restricted: {
      data: {
        email: 'merge-restricted1@example.com',
        name: 'Merge Restricted User',
        role: 'Operator',
      },
    },
  },
  action: {
    one: {
      data: {
        name: 'Test Action 1',
        start_date: new Date('2023-01-01'),
      },
    },
    two: {
      data: {
        name: 'Test Action 2',
        start_date: new Date('2023-01-01'),
      },
    },
  },
  arrestee: {
    one: {
      data: {
        first_name: 'Test',
        last_name: 'Person1',
        custom_fields: { test: true, custom: 'yes' },
      },
    },
    two: {
      data: {
        first_name: 'Test',
        last_name: 'Person2',
        custom_fields: { test: true, custom: 'yes' },
      },
    },
  },
  arrest: {
    one: (scenario) => ({
      data: {
        display_field: 'Target Arrest',
        search_field: 'Target',
        jurisdiction: 'Target City',
        date: new Date('2023-02-26'),
        custom_fields: { test: true, custom: 'yes' },
        arrestee_id: scenario.arrestee.one.id,
        action_id: scenario.action.one.id,
        created_by_id: scenario.user.admin.id,
      },
    }),
    two: (scenario) => ({
      data: {
        display_field: 'Merge Arrest',
        search_field: 'Merge',
        jurisdiction: 'Merge City',
        date: new Date('2023-02-27'),
        custom_fields: { test: true, custom: 'yes' },
        arrestee_id: scenario.arrestee.two.id,
        action_id: scenario.action.one.id,
        created_by_id: scenario.user.admin.id,
      },
    }),
  },
})
