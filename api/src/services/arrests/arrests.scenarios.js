export const standard = defineScenario({
  arrest: {
    one: { data: { display_field: 'String', search_field: 'String' } },
    two: { data: { display_field: 'String', search_field: 'String' } },
  },
  user: {
    test: {
      // id: 1,
      data: {
        id: 1,
        name: 'Greg',
        email: 'foo@bar.com',
      },
    },
  },
})
