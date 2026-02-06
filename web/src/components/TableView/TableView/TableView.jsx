import { Link, routes, navigate } from '@cedarjs/router'
import { useMutation } from '@cedarjs/web'

import { toast } from '@cedarjs/web/toast'

import { timeTag } from 'src/lib/formatters'

const DELETE_TABLE_VIEW_MUTATION = gql`
  mutation DeleteTableViewMutation($id: Int!) {
    deleteTableView(id: $id) {
      id
    }
  }
`

const TableView = ({ tableView }) => {
  const [deleteTableView] = useMutation(DELETE_TABLE_VIEW_MUTATION, {
    onCompleted: () => {
      toast.success('TableView deleted')
      navigate(routes.tableViews())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete tableView ' + id + '?')) {
      deleteTableView({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            TableView {tableView.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{tableView.id}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{tableView.name}</td>
            </tr>
            <tr>
              <th>State</th>
              <td>{tableView.state}</td>
            </tr>
            <tr>
              <th>Type</th>
              <td>{tableView.type}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(tableView.created_at)}</td>
            </tr>
            <tr>
              <th>Created by id</th>
              <td>{tableView.created_by_id}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(tableView.updated_at)}</td>
            </tr>
            <tr>
              <th>Updated by id</th>
              <td>{tableView.updated_by_id}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editTableView({ id: tableView.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(tableView.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default TableView
