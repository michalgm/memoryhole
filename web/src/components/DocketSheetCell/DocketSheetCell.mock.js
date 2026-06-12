// Define your own mock data here:
import { generateMockData } from 'src/test/mocks/generateMockData'

export const standard = (/* vars, { ctx, req } */) => ({
  docketSheet: generateMockData('anArrest', 'ArrestFields', [{}, {}, {}]),
})
