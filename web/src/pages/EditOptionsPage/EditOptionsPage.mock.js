import { generateMockData } from 'src/test/mocks/generateMockData'

mockGraphQLQuery('optionSets', () => ({
  optionSets: generateMockData('anOptionSet', null, [
    { id: 1 },
    { id: 2 },
    { id: 3 },
  ]),
}))

mockGraphQLQuery('OptionSetQuery', (variables) => ({
  optionSet: generateMockData('anOptionSet', null, 1, {
    id: variables.id,
  })[0],
}))
