import { Box, Card, CardContent, CardHeader, Divider, TextField, Typography } from '@mui/material'
import {
  Form,
  Submit,
  useForm,
  useRegister
} from '@redwoodjs/forms'
import { FormContainer, TextFieldElement } from 'react-hook-form-mui'
import {get, startCase} from 'lodash'

import { DateTimePicker } from '@mui/x-date-pickers';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
// import { DateTimePicker as MuiDateTimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { toast } from '@redwoodjs/web/toast'
import { useAuth } from 'src/auth'
import { useState } from 'react'

const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}



const ArresteeArrestForm = (props) => {
  const formMethods = useForm()

  const Field = ({ name, field_type, ...props }) => {
    const register = useRegister({ name })
    const textField = {name,variant: 'standard', fullWidth: true}
    if (field_type === 'date') {
      return <DateTimePicker
        {...props}
        {...register}
        slotProps={{textField}}
        defaultValue={dayjs(props.defaultValue)}
        onChange={(val) => formMethods.setValue(name, val)}
      />
    }
    return <TextField
      {...props}
      {...textField}
      {...register}
    />
  }

  const onSubmit = (data) => {
    if (data.date) {
      data.date = dayjs(data.date)
    }
    props.onSave(data, props?.arrest?.id)

  }
  console.log(props.arrest)

  const formatLabel = label => {
    const index = label.lastIndexOf('.')
    return startCase(label.slice(index + 1))
  }
  const fields = props.fields.map(
    ({fields, title}, index) => {
      return (
        <Grid key={index} xs={12}>
          {title && <Typography variant='h6' gutterBottom>{title}</Typography>}
        <Card>
  {/* <CardHeader title={title}/> */}
  <CardContent>
    {/* Form fields for section 1 */}

          {/* <Divider textAlign="left">

          </Divider> */}
          <Box>
          <Grid container spacing={2}>

            {fields.map(([key, {label, ...options}={}]) => {
              return <Grid xs={6} key={key}>
              <Field
                id={key}
                label={formatLabel(label || key)}
                name={key}
                defaultValue={get(props.arrest, key)}
                {...options}
              />
              </Grid>
            })}
            </Grid>
          </Box>
          </CardContent>
</Card>
        </Grid>
      )
    }
  )

  return (
    <div className="rw-form-wrapper">
      <Form formMethods={formMethods} onSubmit={onSubmit} error={props.error}>
      <Grid container spacing={8}>
      { fields }
      </Grid>
        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default ArresteeArrestForm
