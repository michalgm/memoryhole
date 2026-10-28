import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { SnackBarProvider } from 'src/components/utils/SnackBar'
import { render } from 'src/test/utils/testUtils'

import { settingsSchemas } from '../../../../api/src/services/siteSettings/siteSettings.validation'

import SettingsPage from './SettingsPage'

// Schema defaults, with optional overrides (e.g. saved SMTP settings)
const buildSiteSettings = (overrides = {}) =>
  Object.entries(settingsSchemas).map(([id, schema]) => ({
    id,
    value: id in overrides ? overrides[id] : schema.parse(undefined),
  }))

// What the API returns once Bridge credentials have been saved
// (smtp_pass is redacted by the siteSettings service)
const SAVED_BRIDGE_SMTP = {
  smtp_host: 'protonmail-bridge:25',
  smtp_user: 'bridge-user@proton.me',
  smtp_pass: '__REDACTED__',
}

const renderSettingsPage = (overrides) => {
  mockGraphQLQuery('SettingsQuery', () => ({
    siteSettings: buildSiteSettings(overrides),
  }))
  return render(
    <SnackBarProvider>
      <SettingsPage />
    </SnackBarProvider>
  )
}

const testEmailButton = () =>
  screen.findByRole('button', { name: 'Send Test Email' })

describe('SettingsPage', () => {
  const user = userEvent.setup()

  it('renders successfully', () => {
    expect(() => renderSettingsPage()).not.toThrow()
  })

  describe('when Protonmail Bridge credentials have not been saved', () => {
    it('shows the Bridge setup instructions', async () => {
      renderSettingsPage({ smtp_host: 'protonmail-bridge:25' })

      expect(await screen.findByText('Setup required:')).toBeInTheDocument()
      expect(
        screen.queryByText(/Protonmail Bridge is configured/)
      ).not.toBeInTheDocument()
    })

    it('disables the test email button and explains why', async () => {
      renderSettingsPage({ smtp_host: 'protonmail-bridge:25' })

      await user.type(
        await screen.findByLabelText('Test Email Address'),
        'me@example.com'
      )

      expect(await testEmailButton()).toBeDisabled()
      expect(
        screen.getByText('Save your SMTP settings to send a test email.')
      ).toBeInTheDocument()
    })
  })

  describe('when Protonmail Bridge credentials have been saved', () => {
    it('shows a short configured note instead of the setup instructions', async () => {
      renderSettingsPage(SAVED_BRIDGE_SMTP)

      expect(
        await screen.findByText(/Protonmail Bridge is configured/)
      ).toBeInTheDocument()
      expect(screen.queryByText('Setup required:')).not.toBeInTheDocument()
    })

    it('enables the test email button once an address is entered', async () => {
      renderSettingsPage(SAVED_BRIDGE_SMTP)

      expect(await testEmailButton()).toBeDisabled()

      await user.type(
        screen.getByLabelText('Test Email Address'),
        'me@example.com'
      )

      expect(await testEmailButton()).toBeEnabled()
      expect(screen.queryByText(/^Save your/)).not.toBeInTheDocument()
    })

    it('rejects an invalid test email address', async () => {
      renderSettingsPage(SAVED_BRIDGE_SMTP)

      const address = await screen.findByLabelText('Test Email Address')
      await user.type(address, 'not-an-email')
      await user.tab()

      expect(
        await screen.findByText('Please enter a valid email address')
      ).toBeInTheDocument()
      expect(await testEmailButton()).toBeDisabled()

      await user.clear(address)
      await user.type(address, 'me@example.com')

      expect(await testEmailButton()).toBeEnabled()
      expect(
        screen.queryByText('Please enter a valid email address')
      ).not.toBeInTheDocument()
    })

    it('disables the test email button while SMTP changes are unsaved', async () => {
      renderSettingsPage(SAVED_BRIDGE_SMTP)

      await user.type(
        await screen.findByLabelText('Test Email Address'),
        'me@example.com'
      )
      expect(await testEmailButton()).toBeEnabled()

      await user.type(screen.getByLabelText('SMTP Username'), '-changed')

      expect(await testEmailButton()).toBeDisabled()
      expect(
        screen.getByText('Save your changes to test the new SMTP settings.')
      ).toBeInTheDocument()
    })
  })
})
