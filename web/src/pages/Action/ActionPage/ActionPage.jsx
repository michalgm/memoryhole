import { useCallback } from 'react'

import { navigate, routes } from '@redwoodjs/router'

import FormContainer from 'src/components/utils/FormContainer'
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

  const transformInput = (input) => {
    const fieldsToRemove = ['id', '__typename']
    fieldsToRemove.forEach((k) => delete input[k])
    if (input.actions) {
      input.action_ids = input.actions.map(({ id }) => id)
      delete input.actions
    }
    return input
  }

  const onFetch = useCallback(
    (action) => {
      if (action?.name) {
        setPageTitle(action?.name)
      }
      return action
    },
    [setPageTitle]
  )

  const onDelete = useCallback(() => navigate(routes.actions()), [])

  const onCreate = useCallback(
    (data) => navigate(routes.action({ id: data.id })),
    []
  )

  return (
    <>
      <FormContainer
        fields={ActionFields}
        id={id === 'new' ? null : id}
        displayConfig={{
          type: 'Action',
        }}
        columnCount={1}
        skipUpdatedCheck
        createMutation={CREATE_MUTATION}
        updateMutation={UPDATE_MUTATION}
        deleteMutation={DELETE_MUTATION}
        fetchQuery={QUERY}
        transformInput={transformInput}
        onDelete={onDelete}
        onCreate={onCreate}
        onFetch={onFetch}
      />
    </>
  )
}

export default ActionPage
