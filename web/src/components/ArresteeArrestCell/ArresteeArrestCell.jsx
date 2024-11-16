import ArresteeArrestForm from 'src/components/ArresteeArrestForm'

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
      action_id
      action {
        id
        name
        start_date
      }
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

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ arresteeArrest = null, onSave, error, loading }) => {
  return (
    <ArresteeArrestForm
      arrest={arresteeArrest}
      onSave={onSave}
      loading={loading}
      error={error}
    />
  )
}
