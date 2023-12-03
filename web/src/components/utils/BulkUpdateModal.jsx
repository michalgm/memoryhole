import { Add, Delete } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import { useConfirm } from 'material-ui-confirm'
import { set, useFieldArray, useForm } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'

import { useMutation } from '@redwoodjs/web'

import { schema } from 'src/lib/ArrestFields'

import { Field } from '../utils/Field'

import { useSnackbar } from './SnackBar'

const BULK_UPDATE_ARRESTS = gql`
  mutation BulkUpdateArrests($ids: [Int]!, $input: UpdateArrestInput!) {
    bulkUpdateArrests(ids: $ids, input: $input) {
      count
    }
  }
`

const BulkUpdateModal = ({
  bulkUpdateRows,
  setBulkUpdateRows,
  onSuccess = () => {},
}) => {
  const [bulkUpdate] = useMutation(BULK_UPDATE_ARRESTS)
  const { openSnackbar } = useSnackbar()
  const defaultField = { field_name: null, field_value: null }
  const confirm = useConfirm()

  const context = useForm({ defaultValues: { fields: [{ ...defaultField }] } })
  const { control, getValues, watch, reset } = context

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'fields', // unique name for your Field Array
  })
  const doBulkUpdate = async () => {
    await confirm({
      title: 'Confirm Bulk Update',
      contentProps: { component: 'div' },
      content: (
        <>
          <Typography gutterBottom>
            Are you sure you want to bulk update the following fields on{' '}
            {bulkUpdateRows.length} arrestees?
          </Typography>

          {...getValues().fields.map(({ field_name, field_value }) => {
            return (
              <Typography key={field_name}>
                <b>{fieldLabel(field_name)}:</b> {field_value}
              </Typography>
            )
          })}
        </>
      ),
    })
    try {
      const input = getValues().fields.reduce(
        (acc, { field_name, field_value }) => {
          if (field_name) {
            set(acc, field_name, field_value)
          }
          return acc
        },
        {}
      )
      if (!Object.keys(input).length) {
        throw new Error('No fields set')
      }

      const ids = bulkUpdateRows.map(({ id }) => id)
      const {
        data: {
          bulkUpdateArrests: { count },
        },
      } = await bulkUpdate({ variables: { ids, input } })
      openSnackbar(`${count} arrestee records updated`)
      closeModal()
      onSuccess()
    } catch (error) {
      openSnackbar(`Update failed: ${error}`, 'error')
    }
  }
  const watchFieldArray = watch('fields')
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...(watchFieldArray ? watchFieldArray[index] : []),
    }
  })
  const fieldLabel = (f) =>
    `${f.match('arrestee') ? 'Arrestee ' : ''}${schema[f].props.label}`

  const field_options = Object.keys(schema).map((f) => ({
    id: f,
    label: fieldLabel(f),
  }))

  const closeModal = () => {
    reset()
    setBulkUpdateRows(null)
  }

  return (
    bulkUpdateRows && (
      <Dialog open={Boolean(bulkUpdateRows)} onClose={closeModal}>
        <DialogTitle>Bulk Update {bulkUpdateRows.length} Arrests</DialogTitle>
        <DialogContent>
          <Typography component="ol">
            <li>Choose a field to update from the dropdown on the left.</li>
            <li>
              Enter a value on the right (leave blank to unset the value).
            </li>
            <li>
              Use the &quot;Add Field&quot; button to add additional fields.
            </li>
          </Typography>
          <FormContainer formContext={context}>
            <Grid2 container xs={12} spacing={2} sx={{ width: 550, pt: 2 }}>
              {controlledFields.map((field, index) => (
                <Grid2 container key={field.id} xs={12}>
                  <Grid2 xs={5}>
                    <Field
                      key={index}
                      field_type="select"
                      options={field_options}
                      name={`fields.${index}.field_name`}
                      label="Field"
                    />
                  </Grid2>
                  <Grid2 xs={6}>
                    {field.field_name && (
                      <Field
                        name={`fields.${index}.field_value`}
                        {...schema[field.field_name].props}
                        required={false}
                        helperText={''}
                        label={`${fieldLabel(field.field_name)} Value`}
                      />
                    )}
                  </Grid2>
                  <Grid2 xs={1}>
                    <Tooltip title="Remove Field">
                      <IconButton onClick={() => remove(index)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Grid2>
                </Grid2>
              ))}
              <Grid2 xs={12} sx={{ textAlign: 'right' }}>
                <Button
                  startIcon={<Add />}
                  onClick={() => append({ ...defaultField })}
                >
                  Add Field to Update
                </Button>
              </Grid2>
            </Grid2>
          </FormContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => doBulkUpdate()}
          >
            Bulk Update
          </Button>
        </DialogActions>
      </Dialog>
    )
  )
}

export default BulkUpdateModal
