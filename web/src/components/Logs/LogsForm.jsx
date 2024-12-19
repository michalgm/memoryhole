import { gql } from '@apollo/client'
import { Box, Button, Grid2, Stack } from '@mui/material'

import { useParams, useRoutePath } from '@redwoodjs/router'

import { useApp } from 'src/lib/AppContext'
import { fieldSchema } from 'src/lib/FieldSchemas'

import { BaseForm } from '../utils/BaseForm'
import { Field } from '../utils/Field'
import LoadingButton from '../utils/LoadingButton'

export const LOG_FIELDS = gql`
  fragment LogFields on Log {
    id
    type
    notes
    needs_followup
    arrests {
      id
      arrestee {
        id
        search_display_field
      }
      arrest_city
      date
    }
    action {
      id
      name
      start_date
    }
    created_at
    created_by {
      name
    }
    updated_at
    updated_by {
      name
    }
  }
`

const QUERY = gql`
  query EditLog($id: Int!) {
    log: log(id: $id) {
      ...LogFields
    }
  }
  ${LOG_FIELDS}
`

const CREATE_MUTATION = gql`
  mutation CreateLogMutation($input: CreateLogInput!) {
    createLog(input: $input) {
      ...LogFields
    }
  }
  ${LOG_FIELDS}
`

const UPDATE_MUTATION = gql`
  mutation EditLogMutation($id: Int!, $input: UpdateLogInput!) {
    updateLog(id: $id, input: $input) {
      ...LogFields
    }
  }
  ${LOG_FIELDS}
`
const DELETE_MUTATION = gql`
  mutation DeleteLogMutation($id: Int!) {
    deleteLog(id: $id) {
      id
    }
  }
`

const Row = ({ children, ...props }) => (
  <Stack
    direction="row"
    spacing={2}
    justifyContent={'space-between'}
    alignItems={'center'}
    sx={{ '& > *': { flexGrow: 1, flexBasis: 0 } }}
    {...props}
  >
    {children}
  </Stack>
)

const transformInput = (input) => {
  if (input.action) {
    input.action_id = input.action.id
    delete input.action
  }
  if (input.arrests) {
    input.arrests = input.arrests.map(({ id }) => id)
  }
  return input
}

const LogsForm = ({ callback, log: { id: log_id } = {}, sidebar }) => {
  const { currentAction, currentFormData } = useApp()
  const path = useRoutePath()
  const { id } = useParams()
  const schema = fieldSchema.log

  return (
    <Grid2 size={12}>
      <BaseForm
        formConfig={{
          id: log_id,
          schema,
          modelType: 'Log',
          namePath: 'notes',
          skipDirtyCheck: sidebar,
          createMutation: CREATE_MUTATION,
          deleteMutation: DELETE_MUTATION,
          updateMutation: UPDATE_MUTATION,
          fetchQuery: QUERY,
          onFetch: (log) => {
            if (!log_id && currentAction && currentAction.id !== -1) {
              log.action = currentAction
            }
            return log
          },
          onCreate: callback,
          onUpdate: callback,
          transformInput,
        }}
      >
        {({
          isLoading,
          loading: { loadingCreate, loadingUpdate, loadingDelete },
          confirmDelete,
          formContext: { getValues, setValue },
        }) => {
          const disabled = isLoading
          const enableArrestLink =
            id &&
            path.includes('arrests') &&
            !(getValues().arrests || []).map((a) => a.id).includes(id)

          let enableActionLink =
            currentAction?.id &&
            currentAction.id !== -1 &&
            !getValues().action?.id

          const linkAction = () => {
            setValue('action', currentAction)
            enableActionLink = false
          }

          const linkArrest = () => {
            const {
              id,
              arrestee: { search_display_field },
              date,
              arrest_city,
            } = currentFormData
            setValue('arrests', [
              ...(getValues().arrests || []),
              { id, arrestee: { search_display_field }, date, arrest_city },
            ])
          }
          return (
            <Stack spacing={2}>
              <Row>
                <Field name="type" {...schema.type} />
                <Field
                  name="needs_followup"
                  {...schema.needs_followup}
                  sx={{
                    '& .MuiFormGroup-root': { justifyContent: 'flex-end' },
                  }}
                />
              </Row>
              <Box>
                <Field name="notes" {...schema.notes} focus="true" />
              </Box>
              <Row>
                <Field name="action" {...schema.action} />
                <Field name="arrests" {...schema.arrests} multiple />
              </Row>
              <Row>
                <Button
                  size="small"
                  disabled={!enableActionLink}
                  variant="outlined"
                  onClick={linkAction}
                >
                  Link Current Action
                </Button>
                <Button
                  size="small"
                  disabled={!enableArrestLink}
                  variant="outlined"
                  onClick={linkArrest}
                  sx={{ visibility: sidebar ? undefined : 'hidden' }}
                >
                  Link Current Arrest
                </Button>
              </Row>
              <Stack
                direction="row"
                spacing={2}
                justifyContent={'flex-end'}
                xs={12}
              >
                <Button disabled={disabled} onClick={() => callback()}>
                  Cancel
                </Button>
                <LoadingButton
                  loading={loadingDelete}
                  disabled={disabled}
                  onClick={() => confirmDelete()}
                >
                  Delete
                </LoadingButton>

                <LoadingButton
                  size="small"
                  disabled={disabled}
                  loading={loadingCreate || loadingUpdate}
                  type="submit"
                  variant="contained"
                  color="secondary"
                >
                  {log_id ? 'Save' : 'Create'} Log
                </LoadingButton>
              </Stack>
            </Stack>
          )
        }}
      </BaseForm>
    </Grid2>
  )
}
export default LogsForm
