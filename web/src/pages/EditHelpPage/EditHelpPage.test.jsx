import { screen, waitFor } from '@redwoodjs/testing/web'

import { SnackBarProvider } from 'src/components/utils/SnackBarProvider.mock'
import { render } from 'src/setupTests'

import EditHelpPage from './EditHelpPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

const setting = {
  id: '1',
  value: '<p>This is the site help.</p>',
}

describe('EditHelpPage', () => {
  it('renders successfully', () => {
    mockGraphQLQuery('EditSiteSetting', () => ({ siteSetting: setting }))
    expect(() => {
      render(
        <SnackBarProvider>
          <EditHelpPage />
        </SnackBarProvider>
      )
    }).not.toThrow()
  })
  it('fetches data', async () => {
    mockGraphQLQuery('EditSiteSetting', () => ({ siteSetting: setting }))
    const { container } = render(
      <SnackBarProvider>
        <EditHelpPage />
      </SnackBarProvider>
    )

    const label = await screen.findByText('Site Help')
    await waitFor(() => {
      expect(label).toBeInTheDocument()
      const editField = container.querySelector('.tiptap')
      expect(editField.innerHTML).toEqual(setting.value)
    })
  })
})
