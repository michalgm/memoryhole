import { useState } from 'react'

import { Typography } from '@mui/material'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import ArresteeArrestForm from 'src/components/ArresteeArrestForm'

import { useSnackbar } from '../utils/SnackBar'

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
  const { openSnackbar } = useSnackbar()

  const [createArrest, { loading, error }] = useMutation(
    CREATE_ARREST_MUTATION,
    {
      onCompleted: (data) => {
        openSnackbar('Arrest created')
        navigate(routes.arrest({ id: data.createArrest.id }))
      },
      onError: (error) => {
        openSnackbar(error.message, 'error')
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
    </div>
  )
}

export default NewArresteeArrest
