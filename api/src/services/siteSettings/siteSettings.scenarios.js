export const standard = defineScenario({
  siteSetting: {
    one: { data: { id: 'siteHelp', value: 'hi' } },
    two: { data: { id: 'restriction_settings', value: { expiresAt: true } } },
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
