export const standard = defineScenario({
  arrest: {
    one: {
      data: {
        display_field: 'BULK ONE',
        search_field: 'String',
        date: new Date('2023-02-26'),
        jurisdiction: 'Alameda',
        custom_fields: {
          test: true,
          custom: 'yes',
        },

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
    two: {
      data: {
        display_field: 'BULK TWO',
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
    test2: {
      // id: 1,
      data: {
        id: 1,
        name: 'Greg',
        email: 'foo2@bar.com',
      },
    },
  },
})
