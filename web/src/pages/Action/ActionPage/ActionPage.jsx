import { useEffect } from 'react'

import { navigate, routes } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

import FormContainer from 'src/components/utils/FormContainer'
import { useDisplayError } from 'src/components/utils/SnackBar'
import { useApp } from 'src/lib/AppContext'
import { ActionFields } from 'src/lib/FieldSchemas'

const ACTION_FIELDS = gql`
  fragment ActionFields on Action {
    id
    name
    description
    start_date
    end_date
    jurisdiction
    city
  }
`

export const QUERY = gql`
  query EditAction($id: Int!) {
    action: action(id: $id) {
      ...ActionFields
    }
  }
  ${ACTION_FIELDS}
`

const UPDATE_MUTATION = gql`
  mutation UpdateAction($id: Int!, $input: UpdateActionInput!) {
    updateAction(id: $id, input: $input) {
      ...ActionFields
    }
  }
  ${ACTION_FIELDS}
`

const CREATE_MUTATION = gql`
  mutation CreateAction($input: CreateActionInput!) {
    createAction(input: $input) {
      ...ActionFields
    }
  }
  ${ACTION_FIELDS}
`

export const DELETE_MUTATION = gql`
  mutation deleteAction($id: Int!) {
    deleteAction(id: $id) {
      id
    }
  }
`

const ActionPage = ({ id }) => {
  const { setPageTitle } = useApp()

  const displayError = useDisplayError()

  const { data, loading, error } = useQuery(QUERY, {
    variables: { id: parseInt(id) },
    skip: !id || id === 'new',
    fetchPolicy: 'no-cache',
    onError: displayError,
  })

  useEffect(() => {
    if (data?.action?.name) {
      setPageTitle(data?.action?.name)
    }
  }, [data?.action?.name, setPageTitle])

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
        onCreate={(data) => navigate(routes.action({ id: data.id }))}
      />
    </>
  )
}

export default ActionPage
