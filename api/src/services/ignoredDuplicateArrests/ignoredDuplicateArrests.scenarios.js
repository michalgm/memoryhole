export const standard = defineScenario({
  ignoredDuplicateArrest: {
    one: {
      data: {
        arrest1: { create: {} },
        arrest2: { create: {} },
        created_by: {
          create: {
            email: 'String9001348',
            name: 'String',
          },
        },
      },
    },
    two: {
      data: {
        arrest1: { create: {} },
        arrest2: { create: {} },
        created_by: {
          create: {
            email: 'String3736830',
            name: 'String',
          },
        },
      },
    },
  },
  user: {
    test: {
      // id: 1,
      data: {
        id: 10,
        name: 'Greg',
        email: 'foo2@bar.com',
      },
    },
  },
})
