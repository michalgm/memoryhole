import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { navigate } from '@redwoodjs/router'

import { render } from 'src/setupTests'

import { generateMockData } from '../../test/mocks/generateMockData'

import Log from './Log'

const mockLog = generateMockData('aLog', 'LogFields', [
  { type: 'Email', notes: 'Test log entry', needs_followup: true },
])[0]

const renderLog = (log) => {
  return render(log)
}

describe('Log', () => {
  const mockSetEditItem = jest.fn()
  const mockOnCreate = jest.fn()
  const user = userEvent.setup()
  beforeEach(() => {
    mockGraphQLQuery('EditLog', () => ({ log: mockLog }))
    mockGraphQLQuery('searchActions', () => ({ searchActions: [] }))
    mockGraphQLQuery('lookupArrestNames', () => ({ searchArrests: [] }))
  })

  it('renders basic log information', () => {
    renderLog(
      <Log
        log={mockLog}
        setEditItem={mockSetEditItem}
        onCreate={mockOnCreate}
      />
    )

    expect(screen.getByText('Test log entry')).toBeInTheDocument()
    expect(screen.getByText(mockLog.created_by.name)).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Needs Followup')).toBeInTheDocument()
  })

  it('toggles expanded view when show more/less is clicked', async () => {
    renderLog(
      <Log
        log={mockLog}
        setEditItem={mockSetEditItem}
        onCreate={mockOnCreate}
      />
    )

    const toggleButton = screen.getByText('Show more')
    await user.click(toggleButton)

    expect(screen.getByText('Show less')).toBeInTheDocument()
    expect(screen.getByText(mockLog.action.name)).toBeInTheDocument()
    expect(screen.getByText(mockLog.created_by.name)).toBeInTheDocument()
  })

  it('navigates to action details when action chip is clicked', async () => {
    renderLog(
      <Log
        log={mockLog}
        setEditItem={mockSetEditItem}
        onCreate={mockOnCreate}
      />
    )

    const toggleButton = screen.getByText('Show more')
    await user.click(toggleButton)

    const actionChip = screen.getByText(mockLog.action.name)
    await user.click(actionChip)

    expect(navigate).toHaveBeenCalledWith(`/actions/${mockLog.action.id}`)
  })

  it('navigates to arrest details when arrest chip is clicked', async () => {
    renderLog(
      <Log
        log={mockLog}
        setEditItem={mockSetEditItem}
        onCreate={mockOnCreate}
      />
    )

    const toggleButton = screen.getByText('Show more')
    await user.click(toggleButton)

    const arrestChip = screen.getByText(
      mockLog.arrests[0].arrestee.search_display_field
    )
    await user.click(arrestChip)

    // expect(navigate).toHaveBeenCalledWith('/arrests/456')
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(`/arrests/${mockLog.arrests[0].id}`)
    })
  })

  it('triggers edit mode when edit button is clicked', async () => {
    renderLog(
      <Log
        log={mockLog}
        setEditItem={mockSetEditItem}
        onCreate={mockOnCreate}
      />
    )

    const editButton = screen.getByText('Edit Log')
    await user.click(editButton)

    expect(mockSetEditItem).toHaveBeenCalledWith(mockLog.id)
  })

  it('renders LogsForm when in edit mode', async () => {
    renderLog(
      <Log
        log={mockLog}
        editItem={mockLog.id}
        setEditItem={mockSetEditItem}
        onCreate={mockOnCreate}
      />
    )
    await waitFor(() => {
      expect(screen.getByLabelText('Type *')).toHaveValue('Email')
      expect(screen.getByLabelText('Notes *')).toHaveValue('Test log entry')
      expect(screen.queryByText('Show more')).not.toBeInTheDocument()
      expect(screen.queryByText('Edit Log')).not.toBeInTheDocument()
    })
    await waitFor(() => {})
  })
})
