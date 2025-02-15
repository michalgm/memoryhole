import { useCallback, useEffect } from 'react'

import { navigate, routes } from '@redwoodjs/router'

import FormContainer from 'src/components/utils/FormContainer'
import { useApp } from 'src/lib/AppContext'
import ArrestFields from 'src/lib/FieldSchemas'
export const QUERY = gql`
  query EditArrestById($id: Int!) {
    arrest: arrest(id: $id) {
      ...ArrestFields
    }
  }
`

const UPDATE_ARREST_MUTATION = gql`
  mutation UpdateArrestMutation($id: Int!, $input: UpdateArrestInput!) {
    updateArrest(id: $id, input: $input) {
      ...ArrestFields
    }
  }
`

const CREATE_ARREST_MUTATION = gql`
  mutation CreateArrestMutation($input: CreateArrestInput!) {
    createArrest(input: $input) {
      ...ArrestFields
    }
  }
`

export const DELETE_ARREST_MUTATION = gql`
  mutation deleteArrest($id: Int!) {
    deleteArrest(id: $id) {
      id
    }
  }
`
export const transformInput = (input) => {
  ;[
    'updated_at',
    'updated_by',
    'created_by',
    'created_at',
    'search_field',
    'display_field',
    'id',
  ].forEach((k) => delete input[k])
  if (!input.date) {
    delete input.date
  }
  if (input.action?.id) {
    input.action_id = input.action.id
  }
  delete input.action
  return input
}

const ACTION_TO_ARREST_FIELDS = {
  city: 'arrest_city',
  jurisdiction: 'jurisdiction',
}

const ArrestPage = ({ id }) => {
  const { currentAction, setPageTitle } = useApp()
  const isCreate = !id || id === 'new'
  const { setCurrentFormData } = useApp()

  useEffect(() => {
    return () => setCurrentFormData({})
  }, [setCurrentFormData])

  const applyActionDefaults = (action, target) => {
    if (!action || action.id === -1) return
    Object.entries(ACTION_TO_ARREST_FIELDS).forEach(
      ([actionField, arrestField]) => {
        if (action[actionField]) {
          if (target.setValue) {
            target.setValue(arrestField, action[actionField], {
              shouldDirty: true,
            })
          } else {
            target[arrestField] = action[actionField]
          }
        }
      }
    )
  }

  const fieldProps = {
    action: {
      onChange: (value, context) => {
        applyActionDefaults(value, context)
      },
    },
  }

  const onFetch = useCallback(
    (arrest) => {
      setPageTitle(isCreate ? 'New Arrest' : arrest?.arrestee?.display_field)
      if (
        isCreate &&
        currentAction &&
        arrest &&
        !arrest?.action &&
        currentAction.id !== -1
      ) {
        arrest.action = currentAction
        applyActionDefaults(currentAction, arrest)
      }
      setCurrentFormData(arrest)
      return arrest
    },
    [currentAction, isCreate, setPageTitle, setCurrentFormData]
  )
  const onDelete = useCallback(() => navigate(routes.arrests()), [])
  const onCreate = useCallback(
    (data) => navigate(routes.arrest({ id: data.id })),
    []
  )

  return (
    <>
      <FormContainer
        fields={ArrestFields}
        id={id === 'new' ? null : id}
        fieldProps={fieldProps}
        displayConfig={{
          type: 'Arrest',
          namePath: 'arrestee.display_field',
        }}
        fetchQuery={QUERY}
        createMutation={CREATE_ARREST_MUTATION}
        updateMutation={UPDATE_ARREST_MUTATION}
        deleteMutation={DELETE_ARREST_MUTATION}
        transformInput={transformInput}
        onDelete={onDelete}
        onCreate={onCreate}
        onFetch={onFetch}
      />
    </>
  )
}

export default ArrestPage
