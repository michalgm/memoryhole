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
    mockGraphQLQuery('FetchEntity', () => ({ siteSetting: setting }))
    expect(() => {
      render(
        <SnackBarProvider>
          <EditHelpPage />
        </SnackBarProvider>
      )
    }).not.toThrow()
  })
})
