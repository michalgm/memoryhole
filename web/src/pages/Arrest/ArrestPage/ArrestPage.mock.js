import { generateMockData } from 'src/test/mocks/generateMockData'

mockGraphQLQuery('searchActions', () => ({
  searchActions: generateMockData('anAction', 'ActionFields', 5),
}))

mockGraphQLQuery('EditArrestById', (variables) => {
  return {
    arrest: generateMockData('anArrest', 'ArrestFields', 1, {
      id: variables.id,
    })[0],
  }
})
