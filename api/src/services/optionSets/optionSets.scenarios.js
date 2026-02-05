export const standard = defineScenario({
  optionSet: {
    logType: {
      data: {
        name: 'log_type',
        values: {
          create: [
            { value: 'MyLogType', label: 'My Log Type', order: 1 },
            { value: 'OtherLogType', label: 'Other', order: 2 },
          ],
        },
      },
    },
    jailPopulation: {
      data: {
        name: 'jail_population',
        values: {
          create: [
            { value: 'Unknown', label: 'Unknown', order: 1 },
            { value: 'General', label: 'General', order: 2 },
          ],
        },
      },
    },
    one: { data: { name: 'String4627362' } },
    two: { data: { name: 'String9299623' } },
  },
  log: {
    one: {
      data: {
        time: '2023-01-01T00:00:00Z',
        type: 'MyLogType',
        notes: 'test',
      },
    },
  },
})
