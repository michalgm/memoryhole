import { navigate, routes } from '@redwoodjs/router'

import ArresteeArrestForm from 'src/components/ArresteeArrestForm'
import { toast } from '@redwoodjs/web/toast'
import { useMutation } from '@redwoodjs/web'

const CREATE_ARREST_MUTATION = gql`
  mutation CreateArresteeArrestMutation($input: CreateArrestInput!) {
    createArrest(input: $input) {
      id
      date
      location
      date
      # display_field
      # search_field
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
        dob,
        email,
        phone_1,
        phone_2,
        address
      }
    }
  }
`

const NewArresteeArrest = () => {
  const [createArrest, { loading, error }] = useMutation(
    CREATE_ARREST_MUTATION,
    {
      onCompleted: () => {
        toast.success('Arrest created')
        navigate(routes.arrests())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input) => {
    ['updated_by', 'search_field', 'display_field'].forEach(k => delete input[k])
// input.search_field = ''
// input.display_field = ''
// input.arrestee.display_field = ''
// input.arrestee.search_field = ''

    createArrest({ variables: { input } })
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


  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Arrest</h2>
      </header>
      <div className="rw-segment-main">
        <ArresteeArrestForm onSave={onSave} loading={loading} error={error} fields={fields}/>
      </div>
    </div>
  )
}

export default NewArresteeArrest
