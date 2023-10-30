import { useMutation, useQuery } from '@redwoodjs/web'

import ArresteeArrest from 'src/components/ArresteeArrest'
import ArresteeArrestForm from 'src/components/ArresteeArrestForm'
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
      createdAt
      createdby_id
      updatedAt
      updatedby_id
      updatedBy {
        email
      }
      arrestee {
        arrests {
          id
        }
        first_name
        last_name
        dob,
        email,
        phone_1,
        phone_2,
        address
      }
    }
  }
`

const UPDATE_ARREST_MUTATION = gql`
  mutation UpdateArrestMutation($id: Int!, $input: UpdateArrestInput!) {

    updateArrest(id: $id, input: $input) {
      id
      # display_field
      # search_field
      date
      location
      charges
      arrest_city
      jurisdiction
      citation_number
      arrestee_id
      custom_fields
      # createdAt
      # createdby_id
      # updatedAt
      # updatedby_id
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
        // refresh()
        // navigate(routes.arresteeArrest({id: }))
      },
      refetchQueries: [{ query: QUERY, variables: { id } }],
      awaitRefetchQueries: true,
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = async (input, id, refresh) => {
    ['updated_by', 'search_field', 'display_field'].forEach(k => delete input[k])

    setSaving(true)
    console.log(input.date)
    return updateArrest({ variables: { id, input, refresh }, })

  }
  // console.log(arresteeArrest)
  if (saving) {
    return '...'
  }
  const fields = [
    {
      fields: [
        ['arrestee.first_name'],
        ['arrestee.last_name'],
      ]
    },
    {
      title: 'Contact Info',
      fields: [
        ['arrestee.phone_1'],
        ['arrestee.phone_2'],
        ['arrestee.email'],
        ['arrestee.address'],

      ]
    },
    {
      title: 'Arrest Info',
      fields: [
        ['date', {field_type:'date', label: 'arrest date'}],
        ['location',],
        ['charges'],
        ['arrest_city'],
        ['jurisdiction']
      ]
    }
  ]

  return (<div className="rw-segment">
    <header className="rw-segment-header">
      <h2 className="rw-heading rw-heading-secondary">Edit Arrest</h2>
    </header>
    <div className="rw-segment-main">
      <ArresteeArrestForm arrest={arresteeArrest}
        onSave={onSave} loading={loading} error={error} fields={fields}/>
    </div>
  </div>)
}
