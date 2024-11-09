import { useMutation } from '@redwoodjs/web'

import UserForm from 'src/components/User/UserForm/UserForm'

import { useDisplayError, useSnackbar } from '../../utils/SnackBar'

export const QUERY = gql`
  query EditUser($id: Int!) {
    user: user(id: $id) {
      id
      email
      name
      expiresAt
      role
      custom_fields
      arrest_date_max
      arrest_date_min
      action_ids
      actions {
        id
        name
        start_date
      }
    }
  }
`

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

export const Success = ({ user, id }) => {
  const { openSnackbar } = useSnackbar()
  const displayError = useDisplayError()

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
    console.log(input)
    if (input.actions) {
      input.action_ids = input.actions.map(({ id }) => id)
      delete input.actions
    }

    return updateUser({ variables: { id, input } })
  }

  return (
    <div>
      <UserForm user={user} onSave={onSave} loading={loading} error={error} />
    </div>
  )
}
