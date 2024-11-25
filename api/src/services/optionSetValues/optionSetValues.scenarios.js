export const standard = defineScenario({
  optionSet: {
    one: { data: { name: 'SetA' } },
  },
  optionSetValue: {
    one: (scenario) => ({
      data: {
        label: 'String',
        value: 'String',
        option_set_details: {
          connect: scenario.optionSet.one,
        },
      },
    }),
    two: (scenario) => ({
      data: {
        label: 'String2',
        value: 'String2',
        option_set_details: {
          connect: scenario.optionSet.one,
        },
      },
    }),
  },
})
