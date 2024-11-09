import Action from 'src/components/Action/Action'

export const QUERY = gql`
  query FindActionById($id: Int!) {
    action: action(id: $id) {
      id
      name
      description
      start_date
      end_date
      jurisdiction
      city
      custom_fields
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Action not found</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ action }) => {
  return <Action action={action} />
}
