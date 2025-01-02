import { screen, waitFor } from '@redwoodjs/testing/web'

import { SnackBarProvider } from 'src/components/utils/SnackBar'
import AppProvider from 'src/lib/AppContext'
import { render } from 'src/setupTests'

import ArrestsPage from './ArrestsPage'
import { standard } from './ArrestsPage.mock'

describe('ArrestsPage', () => {
  beforeEach(() => {
    mockGraphQLQuery('FindTableViews', () => {
      return {
        tableViews: [
          {
            id: '1',
            name: 'Test View',
            updated_by_id: 1,
            updated_at: '2023-11-10T12:00:00Z',
            created_at: '2023-11-10T12:00:00Z',
            created_by_id: 1,
            state: '',
            type: 'table',
          },
        ],
      }
    })
    mockGraphQLQuery('ArrestsQuery', () => {
      return standard
    })
  })

  it('renders successfully', async () => {
    expect(() => {
      render(
        <AppProvider>
          <SnackBarProvider>
            <ArrestsPage />
          </SnackBarProvider>
        </AppProvider>
      )
    }).not.toThrow()

    const firstElement = await waitFor(() =>
      screen.getByText(standard.arrests[0].arrestee.display_field)
    )
    expect(firstElement).toBeInTheDocument()
    const secondElement = screen.getByText(
      standard.arrests[1].arrestee.display_field
    )
    expect(secondElement).toBeInTheDocument()
  })
})
