import Arrestee from 'src/components/Arrestee/Arrestee'

export const QUERY = gql`
  query FindArresteeById($id: Int!) {
    arrestee: arrestee(id: $id) {
      id
      display_field
      search_field
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
      notes
      custom_fields
      createdAt
      createdby_id
      updatedAt
      updatedby_id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Arrestee not found</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ arrestee }) => {
  return <Arrestee arrestee={arrestee} />
}
