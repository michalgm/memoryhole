import { SnackBarProvider } from 'src/components/utils/SnackBar'
import { render } from 'src/setupTests'

import { settingsSchemas } from '../../../../api/src/services/siteSettings/siteSettings.validation'

import SettingsPage from './SettingsPage'

const siteSettings = Object.entries(settingsSchemas).map(([id, schema]) => ({
  id,
  value: schema.parse(undefined), // This uses the schema's default values
}))

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
