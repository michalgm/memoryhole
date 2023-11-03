import { flatMap, get, reduce, set, startCase } from 'lodash'
import { useMutation, useQuery } from '@redwoodjs/web'

import ArresteeArrest from 'src/components/ArresteeArrest'
import ArresteeArrestForm from 'src/components/ArresteeArrestForm'
import SnackBar from '../utils/SnackBar'
import { Typography } from '@mui/material'
import dayjs from 'dayjs'
import { toast } from '@redwoodjs/web/toast'
import { useState } from 'react'

export const QUERY = gql`
  query EditArresteeArrestById($id: Int!) {
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
        id
        display_field
        first_name
        last_name
        preferred_name
        pronoun
        dob
        email
        phone_1
        phone_2
        address
        city
        state
        zip
        custom_fields
        # logs {
        #   id
        #   time
        #   type
        #   notes
        #   needs_followup

        # }
        arrests {
          id
        }
      }
    }
  }
`

const UPDATE_ARREST_MUTATION = gql`
  mutation UpdateArresteeArrestMutation($id: Int!, $input: UpdateArrestInput!) {
    updateArrest(id: $id, input: $input) {
      id
      date
      location
      date
      charges
      arrest_city
      jurisdiction
      citation_number
      arrestee_id
      custom_fields
      arrestee {
        id
        first_name
        last_name
        preferred_name
        pronoun
        dob
        email
        phone_1
        phone_2
        address
        city
        state
        zip
        custom_fields
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
  const [showSuccess, setShowSuccess] = useState(false)

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
    ['updated_at','updated_by', 'created_by', 'created_at', 'search_field', 'display_field', 'id'].forEach(
      (k) => delete input[k]
    )
    if (!input.date) {
      delete input.date
    }

    setSaving(true)
    return updateArrest({ variables: { id, input, refresh } })
  }
  // console.log(arresteeArrest)
  // if (saving) {
  //   return '...'
  // }


  return (
    <div>
      <header>
        <Typography variant="h5">
          Edit Arrestee "{arresteeArrest.display_field} {arresteeArrest.arrestee.display_field}"
        </Typography>
      </header>
      <div>
        <ArresteeArrestForm
          arrest={arresteeArrest}
          // arrest={values}
          onSave={onSave}
          loading={loading}
          error={error}
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
