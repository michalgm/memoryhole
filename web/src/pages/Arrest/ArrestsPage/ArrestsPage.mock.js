import { generateMockData } from '../../../test/mocks/generateMockData'
export const standard = {
  arrests: generateMockData('anArrest', 'ArrestFields', [
    {
      id: 1,
      arrestee: { id: 1, display_field: 'John Doe' },
    },
    {
      id: 2,
      arrestee: { id: 2, display_field: 'Jane Doe' },
    },
  ]),
}

mockGraphQLQuery('ArrestsQuery', () => {
  return {
    arrests: generateMockData('anArrest', 'ArrestFields', 8),
  }
})

mockGraphQLQuery('FindTableViews', () => {
  return {
    tableViews: generateMockData('aTableView', null, 8),
  }
})
