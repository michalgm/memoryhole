import { mockGraphQLQuery, render } from '@redwoodjs/testing/web'

import { SnackBarProvider } from 'src/components/utils/SnackBar'
import AppProvider from 'src/lib/AppContext'

import ArrestPage from './ArrestPage'

describe('ArrestPage', () => {
  mockGraphQLQuery('EditArrestById', (variables) => {
    return {
      arrest: {
        id: variables.id,
        created_at: '2023-01-01T00:00:00Z',
        created_by: { name: 'Test User' },
        updated_at: '2023-01-01T00:00:00Z',
        updated_by: { name: 'Test User' },
      },
    }
  })
  it('renders successfully', async () => {
    expect(() => {
      render(
        <AppProvider>
          <SnackBarProvider>
            <ArrestPage id={1} />
          </SnackBarProvider>
        </AppProvider>
      )
    }).not.toThrow()
  })
})
