import { render } from '@redwoodjs/testing/web'

import AdminPage from './AdminPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts
jest.mock('@redwoodjs/router', () => ({
  ...jest.requireActual('@redwoodjs/router'),
  routes: {
    users: jest.fn(() => `/users`),
    actions: jest.fn(() => `/actions`),
    docketSheets: jest.fn(() => `/docketSheets`),
    logs: jest.fn(() => `/logs`),
    tableViews: jest.fn(() => `/tableViews`),
  },
}))

describe('AdminPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AdminPage />)
    }).not.toThrow()
  })
})
