import { Add, Delete } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import dayjs from 'dayjs'
import { capitalize, isBoolean } from 'lodash-es'
import { useConfirm } from 'material-ui-confirm'
import pluralize from 'pluralize'
import { FormContainer, set, useFieldArray, useForm } from 'react-hook-form-mui'

import { useMutation } from '@redwoodjs/web'

import { transformInput as ArrestTransform } from 'src/pages/Arrest/ArrestPage/ArrestPage'
import { transformInput as UserTransform } from 'src/pages/User/UserPage/UserPage'
// import { schema } from 'src/lib/FieldSchemas'

import { Field } from './Field'
import { useDisplayError, useSnackbar } from './SnackBar'

const transforms = {
  arrest: ArrestTransform,
  user: UserTransform,
}

const BulkUpdateModal = ({
  bulkUpdateRows,
  setBulkUpdateRows,
  schema,
  mutation,
  name = '',
  onSuccess = () => {},
}) => {
  const [bulkUpdate] = useMutation(mutation)
  const { openSnackbar } = useSnackbar()
  const displayError = useDisplayError()
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
            {bulkUpdateRows.length} {pluralize(name, bulkUpdateRows.length)}?
          </Typography>

          {getValues().fields.map(({ field_name, field_value }) => {
            let value = field_value

            if (isBoolean(value)) {
              value = field_value ? 'Yes' : 'No'
            } else if (dayjs.isDayjs(value)) {
              value = dayjs(value).format('L hh:mm A')
            } else if (typeof value === 'object') {
              value = value.name || value.label || 'ERROR - unknown type'
            }
            return (
              <Typography key={field_name}>
                <b>{fieldLabel(field_name)}:</b> {value}
              </Typography>
            )
          })}
        </>
      ),
    })
    try {
      const valueMap = getValues().fields.reduce(
        (acc, { field_name, field_value }) => {
          if (field_name) {
            set(acc, field_name, field_value)
          }
          return acc
        },
        {}
      )
      if (!Object.keys(valueMap).length) {
        throw new Error('No fields set')
      }
      const input = transforms[name] ? transforms[name](valueMap) : valueMap
      const ids = bulkUpdateRows.map(({ id }) => id)

      const {
        data: {
          // [`bulkUpdateArrests`]: { count },
          [`bulkUpdate${capitalize(pluralize(name))}`]: { count },
        },
      } = await bulkUpdate({ variables: { ids, input } })
      openSnackbar(`${count} ${name} records updated`)
      closeModal()
      onSuccess()
    } catch (error) {
      displayError(error)
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
        <DialogTitle>
          Bulk Update {bulkUpdateRows.length} {pluralize(name)}
        </DialogTitle>
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
