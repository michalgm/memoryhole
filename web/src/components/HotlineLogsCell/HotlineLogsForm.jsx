import { Save } from '@mui/icons-material'
import { Button, Card, CardActions, CardContent } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import dayjs from 'dayjs'
import { FormContainer } from 'react-hook-form-mui'

import { useMutation } from '@redwoodjs/web'

import { Field } from '../utils/Field'
import { useSnackbar } from '../utils/SnackBar'

export const CREATE_HOTLINE_LOG_MUTATION = gql`
  mutation AddHotlineLogMutation($input: CreateHotlineLogInput!) {
    createHotlineLog(input: $input) {
      id
      type
      notes
    }
  }
`

export const EDIT_HOTLINE_LOG_MUTATION = gql`
  mutation EditHotlineLogMutation($id: Int!, $input: UpdateHotlineLogInput!) {
    updateHotlineLog(id: $id, input: $input) {
      id
      type
      notes
    }
  }
`
const HotlineLogsForm = ({ callback, log: { id: log_id, ...log } = {} }) => {
  const { openSnackbar } = useSnackbar()
  const mutation = log_id
    ? EDIT_HOTLINE_LOG_MUTATION
    : CREATE_HOTLINE_LOG_MUTATION

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
    ? {
        notes: log.notes,
        start_time: dayjs(log.start_time),
        end_time: dayjs(log.end_time),
      }
    : { notes: '', start_time: dayjs(), end_time: dayjs() }

  const onSubmit = (input) => {
    log_id
      ? saveLog({ variables: { id: log_id, input } })
      : saveLog({ variables: { input } })
  }

  return (
    <Card>
      <FormContainer
        defaultValues={defaultValues}
        onSuccess={(data) => onSubmit(data)}
      >
        <CardContent>
          <Grid container spacing={2}>
            <Grid xs={6}>
              <Field
                field_type="date-time"
                name="start_time"
                required={true}
                validation={{
                  validate: (value, formValues) =>
                    (formValues.start_time &&
                      formValues.end_time &&
                      dayjs(formValues.start_time).unix() <
                        dayjs(formValues.end_time).unix()) ||
                    'Start time must be before End time',
                }}
              />
            </Grid>
            <Grid xs={6}>
              <Field field_type="date-time" name="end_time" required={true} />
            </Grid>
            <Grid xs={12}>
              <Field
                field_type="richtext"
                name="notes"
                multiline
                fullWidth
                minRows={log_id ? 1 : 10}
                validation={{
                  validate: (v) => /.+/.test(v) || 'Notes can not be blank',
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: 'end' }}>
          <Button disabled={loading} onClick={() => callback()}>
            Cancel
          </Button>
          <Button
            disabled={loading}
            type="submit"
            variant="contained"
            color="secondary"
            startIcon={<Save />}
          >
            {log_id ? 'Save' : 'Create'} Log
          </Button>
        </CardActions>
      </FormContainer>
    </Card>
  )
}

export default HotlineLogsForm
