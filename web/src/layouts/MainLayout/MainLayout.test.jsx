import { SnackBarProvider } from 'src/components/utils/SnackBar'
import AppProvider from 'src/lib/AppContext'
import { render } from 'src/setupTests'

import MainLayout from './MainLayout'

mockCurrentUser({ name: 'Rob', roles: [] })

describe('MainLayout', () => {
  it('renders successfully', () => {
    expect(async () => {
      render(
        <AppProvider>
          <SnackBarProvider>
            <MainLayout />
          </SnackBarProvider>
        </AppProvider>
      )
    }).not.toThrow()
  })
})
