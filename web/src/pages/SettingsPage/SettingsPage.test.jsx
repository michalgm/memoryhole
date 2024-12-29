import { SnackBarProvider } from 'src/components/utils/SnackBar'
import { render } from 'src/setupTests'

import SettingsPage from './SettingsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts
const siteSettings = {
  id: 'default_restrictions',
  value: {},
}

describe('SettingsPage', () => {
  mockGraphQLQuery('SettingsQuery', () => ({ siteSettings }))

  it('renders successfully', () => {
    expect(() => {
      render(
        <SnackBarProvider>
          <SettingsPage />
        </SnackBarProvider>
      )
    }).not.toThrow()
  })
})
