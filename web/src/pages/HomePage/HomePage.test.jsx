import { render } from '@redwoodjs/testing/web'

import AppProvider from 'src/lib/AppContext'

import HomePage from './HomePage'
jest.mock('@redwoodjs/router', () => ({
  ...jest.requireActual('@redwoodjs/router'),
  routes: {
    home: jest.fn(() => `/`),
  },
}))
//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('HomePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(
        <AppProvider>
          <HomePage />
        </AppProvider>
      )
    }).not.toThrow()
  })
})
