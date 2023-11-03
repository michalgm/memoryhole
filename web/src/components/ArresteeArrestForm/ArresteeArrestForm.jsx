import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Radio,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  AutocompleteElement,
  DatePickerElement,
  DateTimePickerElement,
  FormContainer,
  TextFieldElement,
  useFormContext,
} from 'react-hook-form-mui'
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers'
import {
  _,
  flatMap,
  get,
  isEqual,
  isObject,
  reduce,
  set,
  startCase,
  transform,
} from 'lodash'

import ArresteeLogsCell from '../ArresteeLogsCell/ArresteeLogsCell'
import CreateArresteeLog from '../ArresteeLogsCell/CreateArresteeLog'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
// import { RJSFSchema } from '@rjsf/utils'
// import SchemaForm from '@rjsf/core'
import SchemaForm from '@rjsf/mui'
import Theme from '@rjsf/mui'
// import { DateTimePicker as MuiDateTimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { toast } from '@redwoodjs/web/toast'
import { useAuth } from 'src/auth'
// import { useForm } from 'react-hook-form'
import { useState } from 'react'
import validator from '@rjsf/validator-ajv8'
import { withTheme } from '@rjsf/core'

const Field = ({ name, field_type, tabIndex, ...props }) => {
  const { setValue } = useFormContext()

  const textFieldProps = {
    name,
    variant: 'outlined',
    fullWidth: true,
    size: 'small',
    inputProps: {
      tabIndex
    }
  }

  const renderDatePicker = () => {
    const Component =
      field_type === 'date-time' ? DateTimePickerElement : DatePickerElement
    return (
      <Component {...props} name={name} inputProps={textFieldProps} timeSteps={{ minutes: 1 }} />
    )
  }

  const renderAutocomplete = () => {
    const options = ['', ...props.options].map((opt) =>
      opt.label ? opt : { id: opt, label: opt }
    )
    const autocompleteProps = {
          ...textFieldProps,
          isOptionEqualToValue: (option = {}, value) =>
            option.id === value || option.id === value?.id,
          onChange: (e, value) => setValue(name, value?.id || null),
    }
    delete autocompleteProps.inputProps
    return (
      <AutocompleteElement
        name={name}
        options={options}
        label={props.label}
        matchId
        textFieldProps={textFieldProps}
        autocompleteProps={autocompleteProps}
      />
    )
  }
  const renderTextField = () => {
    const textFieldOptions =
      field_type === 'textarea' ? { multiline: true, minRows: 3 } : {}
    return (
      <TextFieldElement {...props} {...textFieldProps} {...textFieldOptions} />
    )
  }

  switch (field_type) {
    case 'date-time':
    case 'date':
      return renderDatePicker()
    case 'select':
      return renderAutocomplete()
    case 'textarea':
    default:
      return renderTextField()
  }
}

const diffObjects = (a, b) => {
  return transform(b, (result, value, key) => {
    if (!isEqual(value, a[key])) {
      result[key] =
        isObject(value) && isObject(a[key]) ? diffObjects(a[key], value) : value
    }
  })
}

const pruneData = (data, fields) => {
  const fieldPaths = flatMap(fields, (section) =>
    section.fields.map((field) => [field[0], field[1]])
  )
  const buildNewObject = (paths, originalData) =>
    reduce(
      paths,
      (result, [path, params = {}]) => {
        let value = get(originalData, path)
        if (value !== undefined) {
          if (['date', 'date-time'].includes(params.field_type)) {
            value = dayjs(value)
          }
          set(result, path, value)
        }
        return result
      },
      {}
    )

  return buildNewObject(fieldPaths, data)
}

function reorderFieldsLodash(fields) {
  const midPoint = Math.ceil(fields.length / 2)
  fields = fields.map(([name, props = {}], index) => [name, props, index])
  const chunks = _.chunk(fields, midPoint)
  const interleaved = _.zip(...chunks)
  const reorderedFields = _.compact(_.flatten(interleaved))
  return reorderedFields
}

const ArresteeArrestForm = (props) => {
  const values = pruneData(props.arrest, props.fields)
  const onSubmit = (data) => {
    // const diff = diffObjects(props.arrest, data)
    // console.log(data)
    console.warn('SAVING', data)
    props.onSave(data, props?.arrest?.id)
  }

  const formatLabel = (label) => {
    const index = label.lastIndexOf('.')
    return startCase(label.slice(index + 1))
  }

  const fields = props.fields.map(({ fields, title }, groupIndex) => {
    return (
      <Grid xs={12} spacing={2} key={groupIndex} container alignItems={'center'}>
        {title && (
          <Grid xs={12}>
            <Divider
              textAlign="left"
              sx={{ styleOverrides: { 'MuiDivider-root': { width: 5 } } }}
            >
              {title && (
                <Typography variant="h6" gutterBottom>
                  {title}
                </Typography>
              )}
            </Divider>
          </Grid>
        )}
        {reorderFieldsLodash(fields).map(
          ([key, { label, ...options } = {}, index] = []) => {
            return (
              <Grid key={key} xs={6}>
                <Field
                  tabIndex={(100* (groupIndex + 1)) + index}
                  key={key}
                  id={key}
                  label={formatLabel(label || key)}
                  name={key}
                  {...options}
                />
              </Grid>
            )
          }
        )}
      </Grid>
    )
  })
  //  console.log(reorderFieldsLodash(fields)) ||
  const stats = {
    created: dayjs(props?.arrest?.created_at),
    updated: dayjs(props?.arrest?.updated_at),
  }

  const ModTime = ({ time }) => (
    <Typography variant="overline">
      {startCase(time)}&nbsp;
      <Tooltip title={stats[time].format('LLLL')}>
        <b>{stats[time].calendar()}</b>
      </Tooltip>
      &nbsp;by&nbsp;
      <b>{props?.arrest[`${time}_by`]?.name}</b>
    </Typography>
  )
  return (
    <>
      <FormContainer
        defaultValues={values}
        onSuccess={(data) => onSubmit(data)}
      >
        <Grid container spacing={4} className="content-container">
          <Grid xs={12} sx={{ textAlign: 'right', clear: 'both' }}>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </Grid>
          <Grid xs={12} container className="form-content">
            {fields}
          </Grid>
          <Grid xs={6}>
            <ModTime time="created" />
          </Grid>
          <Grid xs={6}>
            <ModTime time="updated" />
          </Grid>
        </Grid>
      </FormContainer>
      <CreateArresteeLog arrestee_id={props.arrest.arrestee.id} />
      <ArresteeLogsCell arrestee_id={props.arrest.arrestee.id} />
    </>
  )
}

export default ArresteeArrestForm
