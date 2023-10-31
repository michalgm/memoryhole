import { useMutation, useQuery } from '@redwoodjs/web'

import ArresteeArrest from 'src/components/ArresteeArrest'
import ArresteeArrestForm from 'src/components/ArresteeArrestForm'
import SnackBar from '../utils/SnackBar'
import { Typography } from '@mui/material'
import { toast } from '@redwoodjs/web/toast'
import { useState } from 'react'

export const QUERY = gql`
  query EditArrestById($id: Int!) {
    arresteeArrest: arrest(id: $id) {
      id
      date
      location
      display_field
      search_field
      date
      charges
      arrest_city
      jurisdiction
      citation_number
      arrestee_id
      custom_fields
      created_at
      created_by {
        name
      }
      updated_at
      updated_by {
        name
      }
      arrestee {
        arrests {
          id
        }
        first_name
        last_name
        dob
        email
        phone_1
        phone_2
        address
      }
    }
  }
`

const UPDATE_ARREST_MUTATION = gql`
  mutation UpdateArrestMutation($id: Int!, $input: UpdateArrestInput!) {
    updateArrest(id: $id, input: $input) {
      id
      date
      location
      charges
      arrest_city
      jurisdiction
      citation_number
      arrestee_id
      custom_fields
      arrestee {
        first_name
        last_name
        dob
        email
        phone_1
        phone_2
        address
        arrests {
          id
        }
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ arresteeArrest, id, ...rest }) => {
  // console.log({rest})
  const { data, refetch } = useQuery(QUERY, { variables: { id } })
  const [saving, setSaving] = useState(false)
  // console.log(arresteeArrest.display_field)
  const [updateArrest, { loading, error }] = useMutation(
    UPDATE_ARREST_MUTATION,
    {
      onCompleted: async () => {
        toast.success('Arrest updated')
        // setHasPosted(true)
        setSaving(false)
        setShowSuccess(true)
        // refresh()
        // navigate(routes.arresteeArrest({id: }))
      },
      refetchQueries: [{ query: QUERY, variables: { id } }],
      awaitRefetchQueries: true,
      onError: (error) => {
        setSaving(false)
        console.log(error.message)
        toast.error(error.message)
      },
    }
  )

  const onSave = async (input, id, refresh) => {
    ;['updated_by', 'search_field', 'display_field'].forEach(
      (k) => delete input[k]
    )

    setSaving(true)
    console.log(input.date)
    return updateArrest({ variables: { id, input, refresh } })
  }
  // console.log(arresteeArrest)
  // if (saving) {
  //   return '...'
  // }
  const fields = [
    {
      fields: [['arrestee.first_name'], ['arrestee.last_name'], ['arrestee.preferred_name']],
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
        ['custom_fields.release_time', {field_type: 'date'}],
        ['custom_fields.release_type'],
      ],
    },
  ]
  const [showSuccess, setShowSuccess] = useState(false)

  return (
    <div>
      <header>
        <Typography variant="h5">Edit Arrestee "{arresteeArrest.display_field}"</Typography>
      </header>
      <div>
        <ArresteeArrestForm
          arrest={arresteeArrest}
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
