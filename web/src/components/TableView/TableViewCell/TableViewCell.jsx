import TableView from 'src/components/TableView/TableView'

export const QUERY = gql`
  query FindTableViewById($id: Int!) {
    tableView: tableView(id: $id) {
      id
      name
      state
      type
      created_at
      created_by_id
      updated_at
      updated_by_id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>TableView not found</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ tableView }) => {
  return <TableView tableView={tableView} />
}
