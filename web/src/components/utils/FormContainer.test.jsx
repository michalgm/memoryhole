import userEvent from '@testing-library/user-event'
import { ConfirmProvider } from 'material-ui-confirm'

import { navigate } from '@redwoodjs/router'
import {
  mockGraphQLMutation,
  mockGraphQLQuery,
  screen,
  waitFor,
} from '@redwoodjs/testing/web'
import { registerFragment } from '@redwoodjs/web/apollo'

import { SnackBarProvider } from 'src/components/utils/SnackBarProvider.mock'
import { render } from 'src/setupTests'

import FormContainer from './FormContainer'

const WrappedFormContainer = (props) => {
  return (
    <SnackBarProvider>
      <ConfirmProvider>
        <FormContainer {...props} />
      </ConfirmProvider>
    </SnackBarProvider>
  )
}

const transformInputMock = jest.fn((input) => input)

// Sample fields configuration
const fields = [
  {
    title: 'Personal Information',
    fields: [
      [
        'arrestee.first_name',
        {
          label: 'Legal First Name',
          placeholder: 'Enter first name',
          rules: {
            required: 'First name is required',
          },
        },
      ],
      [
        'arrestee.last_name',
        {
          label: 'Last Name',
          placeholder: 'Enter last name',
        },
      ],
      [
        'arrestee.email',
        {
          label: 'Email',
          placeholder: 'Enter email',
          rules: {
            validate: (value) =>
              !value ||
              /^[^@\s]+@[^.\s]+\.[^\s]+$/.test(value) ||
              'Email must be formatted like an email',
          },
        },
      ],
    ],
  },
]

// Sample entity data
const entity = {
  id: 1,
  arrestee: {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
  },
  updated_at: '2023-11-10T12:00:00Z',
  updated_by: { name: 'Admin' },
  created_at: '2023-11-10T10:00:00Z',
  created_by: { name: 'Admin' },
}

// Display configuration
const displayConfig = {
  type: 'Arrest',
  namePath: 'arrestee.first_name',
}

registerFragment(gql`
  fragment EntityFields on Arrest {
    id
    arrestee {
      first_name
      last_name
      email
    }
    updated_at
    updated_by {
      name
    }
  }
`)

// Sample mutation and query
const UPDATE_ENTITY_MUTATION = gql`
  mutation UpdateEntity($id: Int!, $input: UpdateArrestInput!) {
    updateArrest(id: $id, input: $input) {
      ...EntityFields
    }
  }
`
const CREATE_ENTITY_MUTATION = gql`
  mutation CreateEntity($input: CreateArrestInput!) {
    createArrest(input: $input) {
      ...EntityFields
    }
  }
`
const DELETE_ENTITY_MUTATION = gql`
  mutation DeleteEntity($id: Int!) {
    deleteArrest(id: $id) {
      id
    }
  }
`

const FETCH_ENTITY_QUERY = gql`
  query FetchEntity($id: Int!) {
    arrest(id: $id) {
      ...EntityFields
    }
  }
`

test('renders form fields correctly', async () => {
  mockGraphQLQuery('FetchEntity', () => {
    return {
      arrest: entity,
    }
  })

  render(
    <SnackBarProvider>
      <FormContainer
        fields={fields}
        id={1}
        displayConfig={displayConfig}
        createMutation={CREATE_ENTITY_MUTATION}
        updateMutation={UPDATE_ENTITY_MUTATION}
        deleteMutation={DELETE_ENTITY_MUTATION}
        fetchQuery={FETCH_ENTITY_QUERY}
      />
    </SnackBarProvider>
  )
  await waitFor(() => {
    expect(screen.getByLabelText('Legal First Name')).toHaveValue('John')
    expect(screen.getByLabelText('Legal Last Name')).toHaveValue('Doe')
    expect(screen.getByLabelText('Email')).toHaveValue('john.doe@example.com')
  })
})

test('submits only changed fields', async () => {
  const user = userEvent.setup()

  let fetchCalled = false
  let updateCalled = false

  let callCount = 0

  mockGraphQLQuery('FetchEntity', () => {
    const responses = [
      {
        arrest: entity,
      },
      {
        arrest: {
          id: 1,
          updated_at: '2023-11-10T12:00:00Z', //Newer date
          updated_by: { name: 'Tester' },
        },
      },
    ]
    const response = responses[callCount]
    if (callCount === 1) {
      fetchCalled = true
    }
    callCount++
    return response
  })

  mockGraphQLMutation('UpdateEntity', (vars) => {
    updateCalled = true
    expect(vars).toEqual({
      id: 1,
      input: {
        arrestee: {
          first_name: 'Jane',
        },
      },
    })
    return {
      updateArrest: {
        id: 1,
        arrestee: {
          first_name: 'Jane',
          last_name: 'Doe',
          email: 'john.doe@example.com',
        },
        updated_at: '2023-11-10T12:00:00Z',
        updated_by: { name: 'Tester' },
      },
    }
  })

  render(
    <WrappedFormContainer
      fields={fields}
      id={entity.id}
      displayConfig={displayConfig}
      createMutation={CREATE_ENTITY_MUTATION}
      updateMutation={UPDATE_ENTITY_MUTATION}
      deleteMutation={DELETE_ENTITY_MUTATION}
      fetchQuery={FETCH_ENTITY_QUERY}
      transformInput={transformInputMock}
    />
  )

  // Change the first name field
  const nameField = await screen.findByLabelText('Legal First Name')

  await waitFor(() => user.click(nameField))
  await waitFor(() => user.clear(nameField))
  await waitFor(() => user.type(nameField, 'Jane'))
  expect(nameField).toHaveValue('Jane')

  await waitFor(() =>
    user.click(screen.getByRole('button', { name: /save arrest/i }))
  )

  const expectedInput = {
    arrestee: {
      first_name: 'Jane',
    },
  }
  await waitFor(() => {
    expect(transformInputMock).toHaveBeenCalled()
    expect(transformInputMock.mock.calls[0][0]).toEqual(expectedInput)
  })

  await waitFor(() => {
    expect(fetchCalled).toBe(true)
  })
  await waitFor(() => {
    expect(updateCalled).toBe(true)
  })
})
test('prevents submission if record has been updated by another user', async () => {
  const { _getMockDisplayError } = require('src/components/utils/SnackBar')
  const displayErrorMock = _getMockDisplayError()
  let callCount = 0

  mockGraphQLQuery('FetchEntity', () => {
    const responses = [
      {
        arrest: entity,
      },
      {
        arrest: {
          id: 1,
          updated_at: '2026-11-10T12:00:00Z', //Newer date
          updated_by: { name: 'Tester' },
        },
      },
    ]
    const response = responses[callCount]
    callCount++
    return response
  })

  mockGraphQLMutation('UpdateEntity', () => {
    console.error('We should not see this')
    expect(true).toBe(false) // This will fail if the mutation is called
  })

  render(
    <WrappedFormContainer
      fields={fields}
      id={entity.id}
      displayConfig={displayConfig}
      createMutation={CREATE_ENTITY_MUTATION}
      updateMutation={UPDATE_ENTITY_MUTATION}
      deleteMutation={DELETE_ENTITY_MUTATION}
      fetchQuery={FETCH_ENTITY_QUERY}
      transformInput={transformInputMock}
    />
  )

  const nameField = await screen.findByLabelText('Legal First Name')

  await waitFor(() => userEvent.click(nameField))
  await waitFor(() => userEvent.clear(nameField))
  await waitFor(() => userEvent.type(nameField, 'Jane'))

  // Submit the form
  await waitFor(() =>
    userEvent.click(screen.getByRole('button', { name: /save arrest/i }))
  )

  await waitFor(() =>
    // Check that the error is displayed
    expect(displayErrorMock).toHaveBeenCalledWith(
      expect.toContainText('Unable to save your changes')
    )
  )
})

test('shows warning when navigating away with unsaved changes', async () => {
  const user = userEvent.setup()
  let callCount = 0

  mockGraphQLQuery('FetchEntity', () => {
    const responses = [
      {
        arrest: entity,
      },
      {
        arrest: {
          id: 1,
          updated_at: '2023-11-10T12:00:00Z',
          updated_by: { name: 'Tester' },
        },
      },
    ]
    const response = responses[callCount]
    callCount++
    return response
  })

  render(
    <WrappedFormContainer
      fields={fields}
      id={entity.id}
      displayConfig={displayConfig}
      createMutation={CREATE_ENTITY_MUTATION}
      updateMutation={UPDATE_ENTITY_MUTATION}
      deleteMutation={DELETE_ENTITY_MUTATION}
      fetchQuery={FETCH_ENTITY_QUERY}
      transformInput={transformInputMock}
    />
  )

  const nameField = await screen.findByLabelText('Legal First Name')

  await waitFor(() => user.click(nameField))
  await waitFor(() => user.clear(nameField))
  await waitFor(() => user.type(nameField, 'Jane'))
  expect(nameField).toHaveValue('Jane')

  const dialog = await screen.queryByText(/are you sure/i, {
    selector: '.MuiTypography-root',
  })
  expect(dialog).not.toBeInTheDocument()

  // Simulate navigation
  await waitFor(() => {
    return navigate('/some-other-route')
  })

  expect(
    await screen.findByText(/are you sure/i, {
      selector: '.MuiTypography-root',
    })
  ).toBeInTheDocument()

  await waitFor(async () => {
    await user.click(screen.getByRole('button', { name: /cancel/i }))
  })

  // make sure we can dismiss the dialog
  await waitFor(() => user.click(nameField))
  await waitFor(() => user.clear(nameField))
  await waitFor(() => user.type(nameField, 'Joe'))
  expect(nameField).toHaveValue('Joe')
})

test('does not warn on nav from new entry', async () => {
  const user = userEvent.setup()

  const createEntity = {
    ...entity,
    id: 2,
    updated_at: '2023-11-10T12:00:00Z',
    updated_by: { name: 'Tester' },
  }

  mockGraphQLMutation('CreateEntity', () => {
    return {
      createArrest: createEntity,
    }
  })

  const onCreateMock = jest.fn((input) => input)
  render(
    <WrappedFormContainer
      fields={fields}
      displayConfig={displayConfig}
      createMutation={CREATE_ENTITY_MUTATION}
      updateMutation={UPDATE_ENTITY_MUTATION}
      deleteMutation={DELETE_ENTITY_MUTATION}
      fetchQuery={FETCH_ENTITY_QUERY}
      onCreate={onCreateMock}
      transformInput={transformInputMock}
    />
  )

  const nameField = await screen.findByLabelText('Legal First Name')

  await waitFor(() => user.click(nameField))
  await waitFor(() => user.clear(nameField))
  await waitFor(() => user.type(nameField, 'Jane'))
  expect(nameField).toHaveValue('Jane')

  const dialog = await screen.queryByText(/are you sure/i, {
    selector: '.MuiTypography-root',
  })
  expect(dialog).not.toBeInTheDocument()

  await waitFor(async () => {
    await user.click(screen.getByRole('button', { name: /save arrest/i }))
  })
  expect(
    await screen.queryByText(/are you sure/i, {
      selector: '.MuiTypography-root',
    })
  ).not.toBeInTheDocument()

  await waitFor(() => {
    expect(onCreateMock).toHaveBeenCalledWith(
      expect.objectContaining(createEntity)
    )
  })
})

test('shows confirmation dialog when deleting entity', async () => {
  const user = userEvent.setup()
  mockGraphQLQuery('FetchEntity', () => {
    return {
      arrest: entity,
    }
  })

  mockGraphQLMutation('DeleteEntity', (vars) => {
    expect(vars.id).toBe(1)
    return {
      deleteArrest: {
        id: vars.id,
      },
    }
  })

  const onDeleteMock = jest.fn()

  render(
    <WrappedFormContainer
      fields={fields}
      id={entity.id}
      displayConfig={displayConfig}
      createMutation={CREATE_ENTITY_MUTATION}
      updateMutation={UPDATE_ENTITY_MUTATION}
      deleteMutation={DELETE_ENTITY_MUTATION}
      fetchQuery={FETCH_ENTITY_QUERY}
      onDelete={onDeleteMock}
      transformInput={transformInputMock}
    />
  )

  await waitFor(async () => {
    const button = await screen.findByRole('button', { name: /delete arrest/i })
    expect(button).toBeInTheDocument()
    await user.click(button)
    expect(button).toBeInTheDocument()
  })
  await waitFor(async () => {
    expect(
      await screen.findByText(/Are you sure you want to delete the arrest/i, {
        selector: '.MuiTypography-root',
      })
    ).toBeInTheDocument()
  })
  // Ensure the confirmation dialog was called with the correct message

  // Click the confirm button
  await waitFor(async () => {
    await user.click(screen.getByRole('button', { name: /ok/i }))
  })
  // Ensure the onDelete callback was called with the correct arguments
  await waitFor(() => {
    expect(onDeleteMock).toHaveBeenCalledWith({ deleteArrest: { id: 1 } })
  })
})

test('shows validation errors for invalid fields', async () => {
  const user = userEvent.setup()
  mockGraphQLQuery('FetchEntity', () => {
    return {
      arrest: entity,
    }
  })
  render(
    <WrappedFormContainer
      fields={fields}
      id={entity.id}
      displayConfig={displayConfig}
      createMutation={CREATE_ENTITY_MUTATION}
      updateMutation={UPDATE_ENTITY_MUTATION}
      deleteMutation={DELETE_ENTITY_MUTATION}
      fetchQuery={FETCH_ENTITY_QUERY}
    />
  )
  const firstNameInput = await screen.findByLabelText('Legal First Name')

  // Clear the first name field to trigger required field validation
  await waitFor(async () => {
    await user.click(firstNameInput)
    await user.clear(firstNameInput)
    firstNameInput.blur()
    await user.tab() // Triggers blur event
  })

  // Submit the form
  await waitFor(async () => {
    await user.click(screen.getByRole('button', { name: /save arrest/i }))
  })
  await waitFor(async () => {})
  expect(
    await screen.findByText('Either first or preferred name must be entered', {
      selector: '.MuiFormHelperText-root',
    })
  ).toBeInTheDocument()

  // Enter an invalid email to trigger email validation
  await waitFor(() => user.clear(screen.getByLabelText('Email')))
  await waitFor(() =>
    user.type(screen.getByLabelText('Email'), 'invalid-email')
  )

  // Submit the form again
  await waitFor(() =>
    user.click(screen.getByRole('button', { name: /save arrest/i }))
  )

  // Expect an email validation error message
  expect(
    await screen.findByText(/email must be formatted/i, {
      selector: '.MuiFormHelperText-root',
    })
  ).toBeInTheDocument()
})

test('resets form state after successful save', async () => {
  const user = userEvent.setup()

  let callCount = 0

  mockGraphQLQuery('FetchEntity', () => {
    const responses = [
      {
        arrest: entity,
      },
      {
        arrest: {
          id: 1,
          updated_at: '2023-11-10T12:00:00Z',
          updated_by: { name: 'Tester' },
        },
      },
    ]
    const response = responses[callCount]
    callCount++
    return response
  })

  mockGraphQLMutation('UpdateEntity', () => {
    return {
      updateArrest: {
        id: 1,
        arrestee: {
          first_name: 'Jane',
          last_name: 'Doe',
          email: 'jane@example.com',
        },
        updated_at: '2023-11-12T12:00:00Z',
        updated_by: { name: 'Tester' },
      },
    }
  })

  render(
    <WrappedFormContainer
      id={entity.id}
      fields={fields}
      displayConfig={displayConfig}
      createMutation={CREATE_ENTITY_MUTATION}
      updateMutation={UPDATE_ENTITY_MUTATION}
      deleteMutation={DELETE_ENTITY_MUTATION}
      fetchQuery={FETCH_ENTITY_QUERY}
      transformInput={transformInputMock}
    />
  )

  // Make changes to fields
  const nameField = await screen.findByLabelText('Legal First Name')
  await waitFor(() => user.click(nameField))
  await waitFor(() => user.clear(nameField))
  await waitFor(() => user.type(nameField, 'Jane'))
  expect(nameField).toHaveValue('Jane')

  // Save the form
  await waitFor(() =>
    user.click(screen.getByRole('button', { name: /save arrest/i }))
  )

  const expectedInput = {
    arrestee: {
      first_name: 'Jane',
    },
  }

  await waitFor(() => {
    expect(transformInputMock).toHaveBeenCalled()
    expect(transformInputMock.mock.calls[0][0]).toEqual(expectedInput)
  })

  await waitFor(() => {
    expect(screen.getByLabelText('Legal First Name')).toHaveValue('Jane')
    expect(screen.getByLabelText('Legal Last Name')).toHaveValue('Doe')
    expect(screen.getByLabelText('Email')).toHaveValue('jane@example.com')
  })
  // Verify form values match the server response
})

// test.only('form reset restores initial values', async () => {
//   // const user = userEvent.setup()

//   const { debug } = render(
//     <WrappedFormContainer
//       fields={fields}
//       entity={entity}
//       displayConfig={displayConfig}
//       createMutation={CREATE_ENTITY_MUTATION}
//       updateMutation={UPDATE_ENTITY_MUTATION}
//       deleteMutation={DELETE_ENTITY_MUTATION}
//       fetchQuery={FETCH_ENTITY_QUERY}
//     />
//   )

//     const nameField = await screen.findByLabelText('Legal First Name')

//   const emailField = screen.getByLabelText('Email')
//   console.log('Initial value:', nameField.value)

//   await waitFor(() => userEvent.click(nameField))
//   console.log('After click:', nameField.value)

//   await waitFor(() => userEvent.clear(nameField))
//   await waitFor(() => userEvent.click(nameField))
//   console.log('After clear:', nameField.value)
//   await waitFor(async () => {
//     await userEvent.type(nameField, 'Jane')
//   })
//   expect(nameField).toHaveValue('Jane')

//   debug(nameField)
//   await waitFor(() => {
//     expect(nameField).toHaveValue('Jane')
//   })
//   await waitFor(() => userEvent.click(emailField))
//   await waitFor(() => userEvent.clear(emailField))
//   await waitFor(() => userEvent.type(emailField, 'jane@example.com'))

//   // Reset the form
//   // await waitFor(() =>
//   //   userEvent.click(screen.getByRole('button', { name: /reset/i }))
//   // )

//   // Verify original values are restored
//   expect(nameField).toHaveValue('John')
//   expect(emailField).toHaveValue('john.doe@example.com')

//   // Form should be clean after reset
//   expect(screen.queryByText('You have unsaved changes')).toBeInTheDocument()
// })
