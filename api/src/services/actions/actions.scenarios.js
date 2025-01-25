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
