import { screen, waitFor } from '@redwoodjs/testing/web'

import { SnackBarProvider } from 'src/components/utils/SnackBar'
import AppProvider from 'src/lib/AppContext'
import { render } from 'src/setupTests'

import DocumentsPage from './DocumentsPage'
import { standard } from './DocumentsPage.mock'

describe('DocumentsPage', () => {
  mockGraphQLQuery('DocumentsQuery', () => {
    return standard
  })
  beforeEach(() => {
    // Mock the modal_layout_header_actions element
    const headerActions = document.createElement('div')
    headerActions.id = 'modal_layout_header_actions'
    document.body.appendChild(headerActions)

    mockCurrentUser({
      id: 1,
      name: 'Test User',
      role: 'Admin',
      email: 'testuser@example.com',
    })
  })

  afterEach(() => {
    const headerActions = document.getElementById('modal_layout_header_actions')
    if (headerActions) {
      headerActions.remove()
    }
  })

  it('renders successfully', async () => {
    expect(() => {
      render(
        <AppProvider>
          <SnackBarProvider>
            <DocumentsPage />
          </SnackBarProvider>
        </AppProvider>
      )
    }).not.toThrow()

    // Wait for data table to render
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument()
    })
  })

  it('renders DataTable component', async () => {
    render(
      <AppProvider>
        <SnackBarProvider>
          <DocumentsPage />
        </SnackBarProvider>
      </AppProvider>
    )

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument()
    })
  })

  it('handles empty document list', async () => {
    mockGraphQLQuery('DocumentsQuery', () => {
      return { documents: [] }
    })

    render(
      <AppProvider>
        <SnackBarProvider>
          <DocumentsPage />
        </SnackBarProvider>
      </AppProvider>
    )

    // DataTable should render with no data
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument()
    })
  })

  it('handles query error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const mockError = new Error('Failed to fetch documents')
    mockGraphQLQuery('DocumentsQuery', () => {
      throw mockError
    })

    render(
      <AppProvider>
        <SnackBarProvider>
          <DocumentsPage />
        </SnackBarProvider>
      </AppProvider>
    )

    // Error should be handled by useDisplayError
    await waitFor(() => {
      // The component should still render
      expect(screen.getByRole('table')).toBeInTheDocument()
    })

    consoleSpy.mockRestore()
  })

  it('passes correct configuration to DataTable', () => {
    render(
      <AppProvider>
        <SnackBarProvider>
          <DocumentsPage />
        </SnackBarProvider>
      </AppProvider>
    )

    // The component should render with proper configuration
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('displays document titles in the table', async () => {
    render(
      <AppProvider>
        <SnackBarProvider>
          <DocumentsPage />
        </SnackBarProvider>
      </AppProvider>
    )

    // Wait for and check that document titles appear
    const firstDoc = await waitFor(() =>
      screen.getByText('Project Documentation')
    )
    expect(firstDoc).toBeInTheDocument()

    const secondDoc = screen.getByText(/Meeting Notes/)

    expect(secondDoc).toBeInTheDocument()
  })

  it('filters out non-document types', async () => {
    render(
      <AppProvider>
        <SnackBarProvider>
          <DocumentsPage />
        </SnackBarProvider>
      </AppProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Project Documentation')).toBeInTheDocument()
    })

    // Wiki page should not be displayed (type !== 'document')
    expect(screen.queryByText('Wiki Page')).not.toBeInTheDocument()
  })
})
