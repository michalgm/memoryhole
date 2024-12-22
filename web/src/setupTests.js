import { afterAll, afterEach, beforeEach, jest } from '@jest/globals'

import { waitFor } from '@redwoodjs/testing/web'

import './test/setup/browserMocks'
import { setupTestServer } from './test/setup/serverSetup'

setupTestServer()

jest.mock('src/components/utils/SnackBar', () =>
  jest.requireActual('src/components/utils/SnackBarProvider.mock')
)

beforeEach(() => {
  jest.clearAllMocks()
})

afterEach(async () => {
  await waitFor(() => {
    // Wait for any pending state updates or async operations
  })
})

afterAll(async () => {
  await waitFor(() => {
    // Wait for any pending state updates or async operations
  })
})

jest.mock('@redwoodjs/router', () => {
  return {
    ...jest.requireActual('@redwoodjs/router'),
    useRoutePath: jest.fn(() => '/mock-route-path'),
    useRouteName: jest.fn((path) => `${path}-route-name`),
  }
})

export { customRender as render } from './test/utils/testUtils'
