import { useCallback, useEffect, useState } from 'react'

import { CompareArrows } from '@mui/icons-material'
import { Button, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { createPortal } from 'react-dom'

import { navigate, routes, useLocation, useRouteName } from '@cedarjs/router'

import { ArrestLayout } from 'src/../../api/src/lib/fieldDefinitions'
import { BaseField } from 'src/components/utils/BaseField'
import FormContainer from 'src/components/utils/FormContainer'
import Show from 'src/components/utils/Show'
import { useApp } from 'src/lib/AppContext'

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

const CompareChooser = () => {
  const { pathname } = useLocation()
  const [showChooser, setShowChooser] = useState(pathname.includes('compare'))

  return (
    <Stack direction={'row'} spacing={1}>
      <Tooltip title="Compare this arrest record to another">
        <Button
          variant="outlined"
          size="x-small"
          onClick={() => setShowChooser(!showChooser)}
        >
          <CompareArrows />
        </Button>
      </Tooltip>
      <Show when={showChooser}>
        <BaseField
          field_type="arrest_chooser"
          name="compare_arrest"
          isRHF={false}
          sx={{ width: 250 }}
          textFieldProps={{
            label: 'Select arrest to compare',
            sx: { backgroundColor: 'background.paper', px: 1 },
            variant: 'standard',
            size: 'x-small',
          }}
          onChange={({ id }) =>
            navigate(`${pathname.replace(/\/compare.+/, '')}/compare/${id}`)
          }
        />
      </Show>
    </Stack>
  )
}
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
  if (input.action !== undefined) {
    input.action_id = input.action?.id || null
    delete input.action
  }
  return input
}

const ACTION_TO_ARREST_FIELDS = {
  city: 'arrest_city',
  jurisdiction: 'jurisdiction',
}

const ArrestPage = ({ id, children, ...props }) => {
  const { currentAction, setPageTitle, setCurrentFormData } = useApp()
  const routeName = useRouteName()
  const isCreate = !id || id === 'new'
  const isDuplicateCompare = routeName === 'findDuplicateArrestsCompare'

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
      setPageTitle({ arrest: arrest?.arrestee?.display_field })
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
  const compareTarget = document.getElementById('modal_layout_header_actions')

  const compareControlPortal = compareTarget
    ? createPortal(<CompareChooser />, compareTarget)
    : null

  return (
    <>
      <FormContainer
        layout={ArrestLayout}
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
        {...props}
      >
        {children}
      </FormContainer>
      {!isCreate && !isDuplicateCompare && compareControlPortal}
    </>
  )
}

export default ArrestPage
