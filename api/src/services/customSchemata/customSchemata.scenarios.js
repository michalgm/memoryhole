export const standard = defineScenario({
  customSchema: {
    one: {
      data: { table: 'String', section: 'String', schema: { foo: 'bar' } },
    },
    two: {
      data: { table: 'String', section: 'String', schema: { foo: 'bar' } },
    },
  },
})
