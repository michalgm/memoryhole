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
    routes: {
      arrests: jest.fn(() => `/arrests`),
      arrest: jest.fn(({ id }) => `/arrest/${id}`),
      actions: jest.fn(() => `/actions`),
      logs: jest.fn(() => `/logs`),
      docsHome: jest.fn(() => `/help`),
      admin: jest.fn(() => `/admin`),
      home: jest.fn(() => `/arrests`),
      users: jest.fn(() => `/admin/users`),
      docketSheets: jest.fn(() => `/admin/docket-sheets`),
      tableViews: jest.fn(() => `/admin/table-views`),
    },
    useRoutePath: jest.fn(() => '/mock-route-path'),
    useRouteName: jest.fn((path) => `${path}-route-name`),
  }
})

export { customRender as render } from './test/utils/testUtils'
