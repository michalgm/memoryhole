import userEvent from '@testing-library/user-event'
import dayjs from 'dayjs'
import { ConfirmProvider } from 'material-ui-confirm'

import { navigate } from '@redwoodjs/router'
import { mockGraphQLQuery, screen, waitFor } from '@redwoodjs/testing/web'

import { SnackBarProvider } from 'src/components/utils/SnackBar'
import AppProvider from 'src/lib/AppContext'
import { render } from 'src/setupTests'

import ArrestPage from './ArrestPage'

const renderArrestPage = (props = {}) => {
  return render(
    <AppProvider>
      <SnackBarProvider>
        <ConfirmProvider>
          <ArrestPage {...props} />
        </ConfirmProvider>
      </SnackBarProvider>
    </AppProvider>
  )
}
const user = userEvent.setup()

const createMutationSpy = jest.fn()

describe('ArrestPage', () => {
  mockGraphQLQuery('searchActions', () => ({ searchActions: [] }))
  mockGraphQLQuery('EditArrestById', (variables) => {
    return {
      arrest: {
        id: variables.id,
        created_at: '2023-01-01T00:00:00Z',
        created_by: { name: 'Test User' },
        updated_at: '2023-01-01T00:00:00Z',
        updated_by: { name: 'Test User' },
        date: dayjs().format('YYYY-MM-DD'),
        jurisdiction: 'Alameda',
        city: 'Oakland',
        arrestee: {
          id: 1,
          first_name: 'Test',
          last_name: 'Arrestee',
          display_field: 'Test Arrestee',
        },
      },
    }
  })
  it('renders successfully', async () => {
    expect(() => {
      renderArrestPage({ id: 1 })
    }).not.toThrow()
    await waitFor(() => {
      expect(screen.getByText('Save Arrest')).toBeInTheDocument()
      expect(screen.getByText('Delete Arrest')).toBeInTheDocument()
    })
    const nameField = await screen.findByLabelText('Legal First Name')
    expect(nameField).toHaveValue('Test')
  })
})

describe('ArrestPage - Create', () => {
  mockGraphQLMutation('CreateArrestMutation', (variables) => {
    createMutationSpy(variables) // Call the spy with the variables

    return {
      createArrest: {
        id: 123,
        ...variables.input,
      },
    }
  })
  it('renders create successfully', async () => {
    expect(() => {
      renderArrestPage()
    }).not.toThrow()

    await waitFor(() => {
      expect(screen.getByText('Save Arrest')).toBeInTheDocument()
    })
    expect(screen.queryByText('Delete Arrest')).not.toBeInTheDocument()
  })

  it('runs save successfully', async () => {
    renderArrestPage({})

    await waitFor(() => {
      expect(screen.getByText('Save Arrest')).toBeInTheDocument()
    })
    expect(screen.queryByText('Delete Arrest')).not.toBeInTheDocument()
    const nameField = await screen.findByLabelText('Legal First Name')
    const dateField = await screen.findByLabelText('Arrest Date *')
    const cityField = await screen.findByLabelText('Arrest City *')

    await user.click(nameField)
    await user.type(nameField, 'Jane')

    await user.type(cityField, 'Oakland')
    await user.keyboard('{ArrowDown}') // Navigate to first option
    await user.keyboard('{Enter}')

    await user.click(dateField)
    await user.keyboard('{Tab}') // Move to time part if datetime picker
    await user.type(dateField, '081020250200A')
    await user.keyboard('{Tab}') // Move to time part if datetime picker

    // expect(cityField).toHaveValue('Oakland')
    // expect(dateField).toHaveValue('08/10/2025 02:00 AM')

    const saveButton = screen.getByRole('button', { name: /save arrest/i })

    await waitFor(() => expect(saveButton).toBeEnabled())
    await user.click(saveButton)

    await waitFor(async () => {
      expect(createMutationSpy).toHaveBeenCalledTimes(1)
    })
    await waitFor(async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
    })
    await waitFor(() => {
      navigate(`/foo`)
    })

    await waitFor(async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
    })

    const dialog = screen.queryByText(/are you sure/i, {
      selector: '.MuiTypography-root',
    })
    expect(dialog).not.toBeInTheDocument()
  })
})
