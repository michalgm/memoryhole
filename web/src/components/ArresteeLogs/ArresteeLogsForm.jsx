import { Button } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { FormContainer } from 'react-hook-form-mui'

import { useMutation } from '@redwoodjs/web'

import { Field } from '../utils/Field'
import { useSnackbar } from '../utils/SnackBar'

export const CREATE_LOG_MUTATION = gql`
  mutation CreateArresteeLogMutation($input: CreateLogInput!) {
    createLog(input: $input) {
      id
      arrestee_id
      type
      notes
      needs_followup
    }
  }
`

export const EDIT_LOG_MUTATION = gql`
  mutation EditArresteeLogMutation($id: Int!, $input: UpdateLogInput!) {
    updateLog(id: $id, input: $input) {
      id
      type
      notes
      needs_followup
    }
  }
`

const ArresteeLogsForm = ({
  arrestee_id,
  callback,
  log: { id: log_id, ...log } = {},
}) => {
  const { openSnackbar } = useSnackbar()

  const mutation = log_id ? EDIT_LOG_MUTATION : CREATE_LOG_MUTATION
  const [saveLog, { loading }] = useMutation(mutation, {
    onCompleted: () => {
      openSnackbar(`Log ${log_id ? 'updated' : 'saved'}`)
      callback(true)
    },
    onError: (error) => {
      openSnackbar(error.message, 'error')
    },
  })
  const defaultValues = log_id
    ? log
    : { arrestee_id, notes: '', needs_followup: false }

  const onSubmit = (input) => {
    log_id
      ? saveLog({ variables: { id: log_id, input } })
      : saveLog({ variables: { input } })
  }

  return (
    <Grid xs={12}>
      <FormContainer
        defaultValues={defaultValues}
        onSuccess={(data) => onSubmit(data)}
      >
        <Grid container spacing={2}>
          <Grid xs={12} container justifyContent="space-between">
            <Grid xs={6}>
              <Field
                field_type="select"
                options={[
                  'Jail Call',
                  'Witness Call',
                  'Support Call',
                  'Out-of-Custody Call',
                  'Email',
                  'Other',
                ]}
                name="type"
              />
            </Grid>

            <Field field_type="checkbox" name="needs_followup" />
          </Grid>
          <Grid xs={12}>
            <Field
              field_type="textarea"
              name="notes"
              multiline
              minRows={log_id ? 1 : 5}
            />
          </Grid>
          <Grid sx={{ textAlign: 'right' }} xs={12}>
            <Button disabled={loading} onClick={() => callback()}>
              Cancel
            </Button>
            <Button disabled={loading} type="submit" variant="contained">
              {log_id ? 'Save' : 'Create'} Log
            </Button>
          </Grid>
        </Grid>
      </FormContainer>
    </Grid>
  )
}
export default ArresteeLogsForm
