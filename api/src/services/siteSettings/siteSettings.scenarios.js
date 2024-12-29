export const standard = defineScenario({
  siteSetting: {
    one: { data: { id: 'String', value: { foo: 'bar' } } },
    two: { data: { id: 'String2', value: { foo: 'bar' } } },
  },
  user: {
    test: {
      data: {
        id: 1,
        name: 'Greg',
        email: 'foo2@bar.com',
      },
    },
  },
})
