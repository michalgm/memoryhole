import { navigate, routes } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

import FormContainer from 'src/components/utils/FormContainer'
import { useDisplayError } from 'src/components/utils/SnackBar'
import { ActionFields } from 'src/lib/FieldSchemas'

export const QUERY = gql`
  query EditAction($id: Int!) {
    action: action(id: $id) {
      id
      name
      description
      start_date
      end_date
      jurisdiction
      city
    }
  }
`

const UPDATE_MUTATION = gql`
  mutation UpdateAction($id: Int!, $input: UpdateActionInput!) {
    updateAction(id: $id, input: $input) {
      id
      name
      description
      start_date
      end_date
      jurisdiction
      city
    }
  }
`

const CREATE_MUTATION = gql`
  mutation CreateAction($input: CreateActionInput!) {
    createAction(input: $input) {
      id
      name
      description
      start_date
      end_date
      jurisdiction
      city
    }
  }
`

export const DELETE_MUTATION = gql`
  mutation deleteAction($id: Int!) {
    deleteAction(id: $id) {
      id
    }
  }
`

const ActionPage = ({ id }) => {
  const displayError = useDisplayError()

  const { data, loading, error } = useQuery(QUERY, {
    variables: { id: parseInt(id) },
    skip: !id || id === 'new',
    onError: displayError,
  })

  const transformInput = (input) => {
    const fieldsToRemove = ['id', '__typename']
    fieldsToRemove.forEach((k) => delete input[k])
    if (input.actions) {
      input.action_ids = input.actions.map(({ id }) => id)
      delete input.actions
    }
    return input
  }

  if (error) return null

  return (
    <>
      <FormContainer
        fields={ActionFields}
        entity={data?.action}
        displayConfig={{
          type: 'Action',
          name: data?.action?.name,
        }}
        loading={loading}
        fetchQuery={QUERY}
        columnCount={1}
        createMutation={CREATE_MUTATION}
        updateMutation={UPDATE_MUTATION}
        deleteMutation={DELETE_MUTATION}
        transformInput={transformInput}
        onDelete={() => navigate(routes.actions())}
        onCreate={(data) =>
          navigate(routes.action({ id: data.createAction.id }))
        }
      />
    </>
  )
}

export default ActionPage
