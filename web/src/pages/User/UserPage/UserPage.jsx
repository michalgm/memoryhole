import { navigate, routes } from '@redwoodjs/router'
import { MetaTags, useMutation } from '@redwoodjs/web'

import UserCell from 'src/components/User/UserCell/UserCell'
import { QUERY } from 'src/components/User/UserCell/UserCell'
import UserForm from 'src/components/User/UserForm/UserForm'
import { useDisplayError, useSnackbar } from 'src/components/utils/SnackBar'

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: Int!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      email
      name
      expiresAt
      arrest_date_max
      arrest_date_min
      role
      action_ids
      custom_fields
    }
  }
`

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      email
      name
      expiresAt
      arrest_date_max
      arrest_date_min
      role
      action_ids
      custom_fields
    }
  }
`

const UserPage = ({ id }) => {
  const { openSnackbar } = useSnackbar()
  const displayError = useDisplayError()

  const [createUser, { loadingCreate, errorCreate }] = useMutation(
    CREATE_USER_MUTATION,
    {
      onCompleted: async ({ createUser: user }) => {
        openSnackbar('User created')
        navigate(routes.user({ id: user.createUser.id }))
      },
      onError: (error) => {
        displayError(error)
      },
    }
  )

  const [updateUser, { loading, error }] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: () => {
      openSnackbar('User updated')
    },
    refetchQueries: [{ query: QUERY, variables: { id } }],
    awaitRefetchQueries: true,
    onError: (error) => {
      displayError(error)
    },
  })

  const onSave = async (input, id) => {
    const fieldsToRemove = ['id', '__typename']
    fieldsToRemove.forEach((k) => delete input[k])
    if (input.actions) {
      input.action_ids = input.actions.map(({ id }) => id)
      delete input.actions
    }
    if (id) {
      return updateUser({ variables: { id, input } })
    } else {
      return createUser({ variables: { input } })
    }
  }
  return (
    <>
      <MetaTags title="Edit User" description="Edit User" />
      {id && id !== 'new' ? (
        <UserCell
          id={parseInt(id)}
          onSave={onSave}
          loading={loading || loadingCreate}
          error={error || errorCreate}
        />
      ) : (
        <UserForm
          onSave={onSave}
          loading={loading || loadingCreate}
          error={error || errorCreate}
        />
      )}
    </>
  )
}

export default UserPage
