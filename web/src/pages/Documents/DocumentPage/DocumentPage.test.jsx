import { ConfirmProvider } from 'material-ui-confirm'

import { fireEvent, screen, waitFor } from '@redwoodjs/testing/web'

import { SnackBarProvider } from 'src/components/utils/SnackBar'
import AppProvider from 'src/lib/AppContext'
import { render } from 'src/setupTests'

import DocumentPage from './DocumentPage'
import { standard } from './DocumentPage.mock'

// Mock CollabEditor component
jest.mock('src/components/CollabEditor/CollabEditor', () => ({
  __esModule: true,
  default: ({ editable, type, title, documentName }) => (
    <div data-testid="collab-editor">
      <div>Type: {type}</div>
      <div>Title: {title}</div>
      <div>Document: {documentName || 'undefined'}</div>
      <div>Editable: {editable ? 'true' : 'false'}</div>
    </div>
  ),
}))

// Mock Loading component
jest.mock('src/components/Loading/Loading', () => ({
  __esModule: true,
  default: () => <div data-testid="loading">Loading...</div>,
}))

describe('DocumentPage', () => {
  beforeEach(() => {
    // Mock the modal_layout_header_actions element
    const headerActions = document.createElement('div')
    headerActions.id = 'modal_layout_header_actions'
    document.body.appendChild(headerActions)

    mockGraphQLQuery('EditDocument', (vars) => {
      return standard[vars.id] || { document: null }
    })

    mockCurrentUser({
      id: 1,
      name: 'Test User',
      role: 'Admin',
    })
  })

  afterEach(() => {
    const headerActions = document.getElementById('modal_layout_header_actions')
    if (headerActions) {
      headerActions.remove()
    }
  })

  it('renders successfully with existing document', async () => {
    expect(() => {
      render(
        <AppProvider>
          <SnackBarProvider>
            <DocumentPage id="doc-1" />
          </SnackBarProvider>
        </AppProvider>
      )
    }).not.toThrow()

    await waitFor(() => {
      expect(screen.getByTestId('collab-editor')).toBeInTheDocument()
    })
  })

  it('displays document title in CollabEditor', async () => {
    render(
      <AppProvider>
        <SnackBarProvider>
          <ConfirmProvider>
            <DocumentPage id="doc-1" />
          </ConfirmProvider>
        </SnackBarProvider>
      </AppProvider>
    )

    await waitFor(() => {
      expect(
        screen.getByText('Title: Project Documentation')
      ).toBeInTheDocument()
    })
  })

  it('displays document name in CollabEditor', async () => {
    render(
      <AppProvider>
        <SnackBarProvider>
          <DocumentPage id="doc-1" />
        </SnackBarProvider>
      </AppProvider>
    )

    await waitFor(() => {
      expect(
        screen.getByText('Document: document:project-documentation')
      ).toBeInTheDocument()
    })
  })

  it('sets editable to false by default for existing documents', async () => {
    render(
      <AppProvider>
        <SnackBarProvider>
          <DocumentPage id="doc-1" />
        </SnackBarProvider>
      </AppProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Editable: false')).toBeInTheDocument()
    })
  })

  it('sets editable to true for new documents', async () => {
    render(
      <AppProvider>
        <SnackBarProvider>
          <DocumentPage id="new" />
        </SnackBarProvider>
      </AppProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Editable: true')).toBeInTheDocument()
    })
  })

  it('shows loading state while fetching document', () => {
    // Mock slow loading
    mockGraphQLQuery('EditDocument', () => {
      return new Promise(() => {}) // Never resolves
    })

    render(
      <AppProvider>
        <SnackBarProvider>
          <DocumentPage id="doc-1" />
        </SnackBarProvider>
      </AppProvider>
    )

    // Loading component should be displayed
    expect(screen.getByTestId('loading')).toBeInTheDocument()
  })

  it('handles missing document gracefully', async () => {
    mockGraphQLQuery('EditDocument', () => {
      return { document: null }
    })

    render(
      <AppProvider>
        <SnackBarProvider>
          <DocumentPage id="non-existent" />
        </SnackBarProvider>
      </AppProvider>
    )

    await waitFor(() => {
      // Should render with "Untitled Document"
      expect(screen.getByText('Title: Untitled Document')).toBeInTheDocument()
    })
  })

  it('renders CollabEditor with correct props', async () => {
    render(
      <AppProvider>
        <SnackBarProvider>
          <DocumentPage id="doc-1" />
        </SnackBarProvider>
      </AppProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('collab-editor')).toBeInTheDocument()
      expect(screen.getByText('Type: document')).toBeInTheDocument()
    })
  })
})

describe('DocumentForm', () => {
  mockGraphQLQuery('EditDocument', (vars) => {
    return standard[vars.id] || { document: null }
  })
  beforeEach(() => {
    mockGraphQLMutation('CreateDocumentMutation', (vars) => {
      return {
        createDocument: {
          id: 'new-doc-id',
          name: `document:${vars.input.title.toLowerCase().replace(/\s+/g, '-')}`,
          ...vars.input,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: { id: 1, name: 'Test User' },
          updated_by: { id: 1, name: 'Test User' },
          parent: null,
          children: [],
        },
      }
    })

    mockGraphQLMutation('UpdateDocumentMutation', (vars) => {
      return {
        updateDocument: {
          ...standard['doc-1'].document,
          ...vars.input,
          updated_at: new Date().toISOString(),
        },
      }
    })

    mockGraphQLMutation('DeleteDocumentMutation', (vars) => {
      return {
        deleteDocument: {
          id: vars.id,
        },
      }
    })

    mockCurrentUser({
      id: 1,
      name: 'Test User',
      role: 'Admin',
    })
  })

  it('renders form for new document', async () => {
    mockGraphQLQuery('EditDocument', (vars) => {
      return standard[vars.id] || { document: null }
    })

    const { DocumentForm } = require('./DocumentPage')
    const handleClose = jest.fn()
    const onCreate = jest.fn()

    render(
      <AppProvider>
        <SnackBarProvider>
          <DocumentForm handleClose={handleClose} onCreate={onCreate} />
        </SnackBarProvider>
      </AppProvider>
    )
    await waitFor(() => {
      expect(screen.getByText('New Document Properties')).toBeInTheDocument()
      expect(screen.getByText('Create Document')).toBeInTheDocument()
    })
  })

  it('renders form for existing document', async () => {
    const { DocumentForm } = require('./DocumentPage')
    const handleClose = jest.fn()
    const onUpdate = jest.fn()

    render(
      <AppProvider>
        <SnackBarProvider>
          <DocumentForm
            id="doc-1"
            handleClose={handleClose}
            onUpdate={onUpdate}
          />
        </SnackBarProvider>
      </AppProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Edit Document Properties')).toBeInTheDocument()
      expect(screen.getByText('Update Document')).toBeInTheDocument()
    })
  })

  it('shows delete button for existing documents', async () => {
    const { DocumentForm } = require('./DocumentPage')
    const handleClose = jest.fn()

    render(
      <AppProvider>
        <SnackBarProvider>
          <DocumentForm id="doc-1" handleClose={handleClose} />
        </SnackBarProvider>
      </AppProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Delete Document')).toBeInTheDocument()
    })
  })

  it('does not show delete button for new documents', async () => {
    const { DocumentForm } = require('./DocumentPage')
    const handleClose = jest.fn()

    render(
      <AppProvider>
        <SnackBarProvider>
          <DocumentForm handleClose={handleClose} />
        </SnackBarProvider>
      </AppProvider>
    )
    await waitFor(() => {
      // expect(screen.getByText('Create Document')).toBeInTheDocument()
      expect(screen.queryByText('Delete Document')).not.toBeInTheDocument()
    })
  })

  it('calls handleClose when cancel button clicked', async () => {
    const { DocumentForm } = require('./DocumentPage')
    const handleClose = jest.fn()

    render(
      <AppProvider>
        <SnackBarProvider>
          <DocumentForm handleClose={handleClose} />
        </SnackBarProvider>
      </AppProvider>
    )
    await waitFor(() => {
      expect(screen.getByText('Cancel')).toBeInTheDocument()
    })
    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    expect(handleClose).toHaveBeenCalled()
  })
})
