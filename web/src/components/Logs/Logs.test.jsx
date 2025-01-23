import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { SnackBarProvider } from 'src/components/utils/SnackBar'
import AppProvider from 'src/lib/AppContext'
import { render } from 'src/setupTests'

import { generateMockData } from '../../test/mocks/generateMockData'

import Logs from './Logs'

// Mock the asyncDebounce function
jest.mock('src/lib/utils', () => ({
  // Use all the original exports
  ...jest.requireActual('src/lib/utils'),
  // Override asyncDebounce to call the function immediately
  asyncDebounce: (fn) => fn,
}))

const mockLogs = generateMockData('aLog', 'LogFields', [
  { type: 'Email', notes: 'Test log 1' },
  { type: 'Phone', notes: 'Test log 2' },
])

// console.log(mockLogs)
const renderLogs = (props = {}) => {
  return render(
    <AppProvider>
      <SnackBarProvider>
        <Logs {...props} />
      </SnackBarProvider>
    </AppProvider>
  )
}

describe('Logs', () => {
  const user = userEvent.setup()
  const { _getMockDisplayError } = require('src/components/utils/SnackBar')
  const displayErrorMock = _getMockDisplayError()

  beforeEach(() => {
    mockGraphQLQuery('FetchLogs', () => ({ logs: mockLogs }))
    mockGraphQLQuery('searchActions', () => ({ searchActions: [] }))
    mockGraphQLQuery('lookupArrestNames', () => ({ searchArrests: [] }))
    mockGraphQLQuery('searchUsers', () => ({ searchUsers: [] }))
  })

  it('renders logs list and filter section', async () => {
    renderLogs()

    await waitFor(() => {
      expect(screen.getByText('Test log 1')).toBeInTheDocument()
      expect(screen.getByText('Test log 2')).toBeInTheDocument()
      expect(screen.getByLabelText('Search')).toBeInTheDocument()
    })
  })

  it('shows loading state while fetching logs', async () => {
    renderLogs()

    expect(
      screen.getByRole('progressbar', { name: 'loading-logs' })
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })
  })

  it('shows "No Logs Found" when query returns empty', async () => {
    mockGraphQLQuery('FetchLogs', () => ({ logs: [] }))
    renderLogs()

    await waitFor(() => {
      expect(screen.getByText('No Logs Match Search')).toBeInTheDocument()
    })
  })

  it('renders new log form when newLogRequested prop is true', async () => {
    renderLogs({ newLogRequested: true })

    await waitFor(() => {
      expect(screen.getByText('New Log')).toBeInTheDocument()
      expect(screen.getByLabelText('Type *')).toBeInTheDocument()
    })
  })

  it('shows new log button in sidebar mode', async () => {
    renderLogs({ sidebar: true })

    await waitFor(() => {
      expect(screen.getByText('New Log')).toBeInTheDocument()
    })
  })

  it('filters logs when search is performed', async () => {
    const filteredLogs = [mockLogs[0]]
    mockGraphQLQuery('FetchLogs', () => ({ logs: filteredLogs }))

    renderLogs()
    const searchInput = await screen.findByLabelText('Search')

    await user.type(searchInput, 'Test log 1')

    await waitFor(() => {
      expect(screen.getByText('Test log 1')).toBeInTheDocument()
      expect(screen.queryByText('Test log 2')).not.toBeInTheDocument()
    })
  })

  it('calls onNewLogComplete callback after creating new log', async () => {
    const onNewLogComplete = jest.fn()

    mockGraphQLMutation('CreateLogMutation', () => ({
      createLog: {
        ...mockLogs[0],
      },
    }))
    renderLogs({ onNewLogComplete, newLogRequested: true })

    // Find form elements and submit
    const typeSelect = await screen.findByLabelText('Type *')
    const notesInput = await screen.findByLabelText('Notes *')
    const submitButton = screen.getByRole('button', { name: /create log/i })

    await user.type(notesInput, 'Test log')
    await user.type(typeSelect, 'Email')

    await user.keyboard('{ArrowDown}')
    await user.keyboard('{Enter}')
    expect(typeSelect).toHaveValue('Email')

    await user.click(submitButton)

    await waitFor(() => {
      expect(
        screen.queryByText('This field is required')
      ).not.toBeInTheDocument()
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(displayErrorMock).not.toHaveBeenCalled()
      expect(onNewLogComplete).toHaveBeenCalled()
    })
  })
})
