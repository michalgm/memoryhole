import Arrest from 'src/components/Arrest/Arrest'

export const QUERY = gql`
  query FindArrestById($id: Int!) {
    arrest: arrest(id: $id) {
      id
      display_field
      search_field
      date
      location
      charges
      arrest_city
      jurisdiction
      citation_number
      arrestee_id
      custom_fields
      created_at
      created_by_id
      updated_at
      updated_by_id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Arrest not found</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ arrest }) => {
  return <Arrest arrest={arrest} />
}
