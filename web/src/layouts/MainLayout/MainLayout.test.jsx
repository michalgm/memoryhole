import { RouterContextProvider } from '@redwoodjs/router/dist/router-context'
import { render } from '@redwoodjs/testing/web'

import { SnackBarProvider } from 'src/components/utils/SnackBar'
import AppProvider from 'src/lib/AppContext'

import MainLayout from './MainLayout'

jest.mock('@redwoodjs/router', () => ({
  ...jest.requireActual('@redwoodjs/router'),
  routes: {
    home: jest.fn(() => `/`),
    actions: jest.fn(() => `/`),
    hotlineLogs: jest.fn(() => `/`),
    docsHome: jest.fn(() => `/`),
  },
}))
mockCurrentUser({ name: 'Rob', roles: [] })

// import mockUser from './MainLayout.mock'
// import { hotlineLogs } from '../../../../api/src/services/hotlineLogs/hotlineLogs';
// Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('MainLayout', () => {
  it('renders successfully', () => {
    expect(async () => {
      render(
        <AppProvider>
          <SnackBarProvider>
            <RouterContextProvider>
              <MainLayout />
            </RouterContextProvider>
          </SnackBarProvider>
        </AppProvider>
      )
    }).not.toThrow()
  })
})
