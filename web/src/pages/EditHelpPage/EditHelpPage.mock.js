const setting = {
  id: '1',
  value: '<p>This is the site help.</p>',
  __typename: 'SiteSetting',
}
mockGraphQLQuery('EditSiteSetting', () => ({ siteSetting: setting }))
