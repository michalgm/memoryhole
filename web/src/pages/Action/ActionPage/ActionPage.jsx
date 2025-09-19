import { useCallback, useRef } from 'react'

import { Assignment } from '@mui/icons-material'
import { Button, Checkbox, FormControlLabel, Typography } from '@mui/material'
import { Box } from '@mui/system'
import pluralize from 'pluralize'
import { createPortal } from 'react-dom'

import { navigate, routes } from '@redwoodjs/router'

import FormContainer from 'src/components/utils/FormContainer'
import Link from 'src/components/utils/Link'
import { defaultAction, useApp } from 'src/lib/AppContext'
import { ActionFields } from 'src/lib/FieldSchemas'
import * as _fragments from 'src/lib/gql_fragments'

export const QUERY = gql`
  query EditAction($id: Int!) {
    action: action(id: $id) {
      ...ActionFields
    }
  }
`

const UPDATE_MUTATION = gql`
  mutation UpdateAction($id: Int!, $input: UpdateActionInput!) {
    updateAction(id: $id, input: $input) {
      ...ActionFields
    }
  }
`

const CREATE_MUTATION = gql`
  mutation CreateAction($input: CreateActionInput!) {
    createAction(input: $input) {
      ...ActionFields
    }
  }
`

export const DELETE_MUTATION = gql`
  mutation deleteAction($id: Int!, $deleteRelations: Boolean) {
    deleteAction(id: $id, deleteRelations: $deleteRelations) {
      id
    }
  }
`

const ActionPage = ({ id }) => {
  const { setPageTitle, currentAction, setCurrentAction } = useApp()
  const deleteRelations = useRef(false)

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
        setPageTitle({ action: action?.name })
      }
      return action
    },
    [setPageTitle]
  )

  const onDelete = useCallback(() => {
    if (currentAction.id === id) {
      setCurrentAction(defaultAction)
    }
    navigate(routes.actions())
  }, [currentAction.id, id, setCurrentAction])

  const onCreate = useCallback(
    (data) => navigate(routes.action({ id: data.id })),
    []
  )

  const getDeleteParams = useCallback(() => {
    return { deleteRelations: deleteRelations.current }
  }, [])
  const whiteBoardTarget = document.getElementById(
    'modal_layout_header_actions'
  )
  const whiteBoardPortal = createPortal(
    <Link to={routes.actionWhiteboard({ id })}>
      <Button startIcon={<Assignment />} size="medium" variant="outlined">
        Whiteboard
      </Button>
    </Link>,
    whiteBoardTarget
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
        deleteOptions={{
          onConfirm: () => {
            deleteRelations.current = false
          },
          renderContent: (actionData) => {
            const { arrests_count, logs_count } = actionData
            return (
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="delete-relations-confirmation"
                      name="deleteRelations"
                      onChange={(e) => {
                        deleteRelations.current = e.target.checked
                      }}
                    />
                  }
                  label="Delete related records"
                />
                <Typography variant="body2">
                  If you check this box, {arrests_count}{' '}
                  {pluralize('arrest', arrests_count)} and {logs_count}{' '}
                  {pluralize('log', logs_count)} associated with this action
                  will be also deleted.
                </Typography>
              </Box>
            )
          },
          getDeleteParams,
        }}
      />
      {whiteBoardPortal}
    </>
  )
}

export default ActionPage
