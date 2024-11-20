import { navigate, routes } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

import FormContainer from 'src/components/utils/FormContainer'
import { useDisplayError } from 'src/components/utils/SnackBar'
import { UserFields } from 'src/lib/FieldSchemas'

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

export const DELETE_USER_MUTATION = gql`
  mutation deleteUser($id: Int!) {
    deleteUser(id: $id) {
      id
    }
  }
`

export const transformInput = (input) => {
  const fieldsToRemove = ['id', '__typename']
  fieldsToRemove.forEach((k) => delete input[k])
  if (input.actions) {
    input.action_ids = input.actions.map(({ id }) => id)
    delete input.actions
  }
  return input
}

const UserPage = ({ id }) => {
  const displayError = useDisplayError()

  const { data, loading, error } = useQuery(QUERY, {
    variables: { id: parseInt(id) },
    skip: !id || id === 'new',
    onError: displayError,
  })

  if (error) return null

  return (
    <>
      <FormContainer
        fields={UserFields}
        entity={data?.user}
        displayConfig={{
          type: 'User',
          name: data?.user?.name,
        }}
        loading={loading}
        fetchQuery={QUERY}
        columnCount={1}
        createMutation={CREATE_USER_MUTATION}
        updateMutation={UPDATE_USER_MUTATION}
        deleteMutation={DELETE_USER_MUTATION}
        transformInput={transformInput}
        onDelete={() => navigate(routes.users())}
        onCreate={(data) => navigate(routes.user({ id: data.createUser.id }))}
      />
    </>
  )
}

export default UserPage
