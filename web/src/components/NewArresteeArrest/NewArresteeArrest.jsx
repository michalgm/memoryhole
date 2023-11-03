import { navigate, routes } from '@redwoodjs/router'

import ArresteeArrestForm from 'src/components/ArresteeArrestForm'
import SnackBar from '../utils/SnackBar'
import { Typography } from '@mui/material'
import { toast } from '@redwoodjs/web/toast'
import { useMutation } from '@redwoodjs/web'
import { useState } from 'react'

const CREATE_ARREST_MUTATION = gql`
  mutation CreateArresteeArrestMutation($input: CreateArrestInput!) {
    createArrest(input: $input) {
      id
      arrestee {
        id
      }
    }
  }
`

const NewArresteeArrest = () => {
  const [saving, setSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const [createArrest, { loading, error }] = useMutation(
    CREATE_ARREST_MUTATION,
    {
      onCompleted: (data) => {
        console.log(data)
        toast.success('Arrest created')
        navigate(routes.arresteeArrest({id: data.createArrest.id}))
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = async (input, id, refresh) => {
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
    setSaving(true)
    return createArrest({ variables: { input } })
  }

  const fields = [
    {
      fields: [['arrestee.first_name'], ['arrestee.last_name']],
    },
    {
      title: 'Contact Info',
      fields: [
        ['arrestee.phone_1'],
        ['arrestee.phone_2'],
        ['arrestee.email'],
        ['arrestee.address'],
      ],
    },
    {
      title: 'Arrest Info',
      fields: [
        ['date', { field_type: 'date', label: 'arrest date' }],
        ['location'],
        ['charges'],
        ['arrest_city'],
        ['jurisdiction'],
      ],
    },
  ]

  return (
    <div>
      <header>
        <Typography variant="h5">Create Arrestee</Typography>
      </header>
      <div>
        <ArresteeArrestForm
          arrest={{}}
          // arrest={values}
          onSave={onSave}
          loading={loading}
          error={error}
          fields={fields}
        />
      </div>
      <SnackBar
        open={Boolean(error?.message)}
        severity="error"
        message={error?.message}
      />

      <SnackBar
        open={showSuccess}
        handleClose={() => setShowSuccess(false)}
        severity="success"
        message={'Arrestee Saved!'}
        autoHideDuration={6000}
      />
    </div>
  )
}

export default NewArresteeArrest
