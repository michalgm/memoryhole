import { gql } from '@apollo/client'
import { Box, Button, Grid2, Stack, Tooltip } from '@mui/material'

import { useParams, useRoutePath } from '@redwoodjs/router'

import Show from 'src/components/utils/Show'
import { useApp } from 'src/lib/AppContext'
import dayjs from 'src/lib/dayjs'
import { fieldSchema } from 'src/lib/FieldSchemas'

import { BaseForm } from '../utils/BaseForm'
import { Field } from '../utils/Field'
import LoadingButton from '../utils/LoadingButton'

const QUERY = gql`
  query EditLog($id: Int!) {
    log: log(id: $id) {
      ...LogFields
    }
  }
`

const CREATE_MUTATION = gql`
  mutation CreateLogMutation($input: CreateLogInput!) {
    createLog(input: $input) {
      ...LogFields
    }
  }
`

const UPDATE_MUTATION = gql`
  mutation EditLogMutation($id: Int!, $input: UpdateLogInput!) {
    updateLog(id: $id, input: $input) {
      ...LogFields
    }
  }
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
    alignItems={'flex-start'}
    sx={{ '& > *': { flexGrow: 1, flexBasis: 0 } }}
    {...props}
  >
    {children}
  </Stack>
)

const transformInput = (input) => {
  if (input.action !== undefined) {
    input.action_id = input.action?.id || null
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
          namePath: 'time',
          skipDirtyCheck: sidebar,
          createMutation: CREATE_MUTATION,
          deleteMutation: DELETE_MUTATION,
          updateMutation: UPDATE_MUTATION,
          fetchQuery: QUERY,
          defaultValues: {
            time: dayjs(),
          },
          onFetch: (log) => {
            if (!log_id && currentAction && currentAction.id !== -1) {
              log.action = currentAction
            }
            return log
          },
          onCreate: callback,
          onUpdate: callback,
          onDelete: callback,
          transformInput,
        }}
      >
        {({
          isLoading,
          loading: { loadingCreate, loadingUpdate, loadingDelete },
          confirmDelete,
          formContext: { getValues, setValue, watch },
          hasDirtyFields,
        }) => {
          const disabled = isLoading
          const isSummary = watch('type') === 'Shift Summary'

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
              <Box>
                <Field
                  name="notes"
                  {...schema.notes}
                  focus="true"
                  highlightDirty
                />
              </Box>
              <Row>
                <Field name="time" {...schema.time} />
              </Row>
              <Row>
                <Field name="type" {...schema.type} highlightDirty />
                <Show unless={isSummary}>
                  <Field
                    name="needs_followup"
                    {...schema.needs_followup}
                    sx={{
                      '& .MuiFormGroup-root': { justifyContent: 'flex-end' },
                    }}
                    highlightDirty
                  />
                </Show>
              </Row>
              <Show when={isSummary}>
                <Row>
                  <Field
                    name="shift.coordinators"
                    {...schema['shift.coordinators']}
                  />
                  <Field
                    name="shift.operators"
                    {...schema['shift.operators']}
                  />
                </Row>
                <Row>
                  <Field
                    name="shift.start_time"
                    {...schema['shift.start_time']}
                  />
                  <Field name="shift.end_time" {...schema['shift.end_time']} />
                </Row>
              </Show>
              <Row>
                <Field name="action" {...schema.action} highlightDirty />
                <Field
                  name="arrests"
                  {...schema.arrests}
                  multiple
                  highlightDirty
                />
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
              <Stack direction="row" spacing={2} justifyContent={'flex-end'}>
                <Button disabled={disabled} onClick={() => callback()}>
                  Cancel
                </Button>
                <Show when={Boolean(log_id)}>
                  <LoadingButton
                    loading={loadingDelete}
                    disabled={disabled}
                    onClick={() => confirmDelete()}
                  >
                    Delete
                  </LoadingButton>
                </Show>
                <Tooltip
                  title={
                    !loadingCreate &&
                    !loadingUpdate &&
                    !hasDirtyFields &&
                    'There are no changes to be saved'
                  }
                  placement="top"
                >
                  <Box>
                    <LoadingButton
                      size="small"
                      disabled={disabled || !hasDirtyFields}
                      loading={loadingCreate || loadingUpdate}
                      type="submit"
                      variant="contained"
                      color="secondary"
                    >
                      {log_id ? 'Save' : 'Create'} Log
                    </LoadingButton>
                  </Box>
                </Tooltip>
              </Stack>
            </Stack>
          )
        }}
      </BaseForm>
    </Grid2>
  )
}
export default LogsForm
