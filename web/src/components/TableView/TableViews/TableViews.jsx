import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/TableView/TableViewsCell'
import { timeTag, truncate } from 'src/lib/formatters'

const DELETE_TABLE_VIEW_MUTATION = gql`
  mutation DeleteTableViewMutation($id: Int!) {
    deleteTableView(id: $id) {
      id
    }
  }
`

const TableViewsList = ({ tableViews }) => {
  const [deleteTableView] = useMutation(DELETE_TABLE_VIEW_MUTATION, {
    onCompleted: () => {
      toast.success('TableView deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete tableView ' + id + '?')) {
      deleteTableView({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>State</th>
            <th>Type</th>
            <th>Created at</th>
            <th>Created by id</th>
            <th>Updated at</th>
            <th>Updated by id</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {tableViews.map((tableView) => (
            <tr key={tableView.id}>
              <td>{truncate(tableView.id)}</td>
              <td>{truncate(tableView.name)}</td>
              <td>{truncate(tableView.state)}</td>
              <td>{truncate(tableView.type)}</td>
              <td>{timeTag(tableView.created_at)}</td>
              <td>{truncate(tableView.created_by_id)}</td>
              <td>{timeTag(tableView.updated_at)}</td>
              <td>{truncate(tableView.updated_by_id)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.tableView({ id: tableView.id })}
                    title={'Show tableView ' + tableView.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editTableView({ id: tableView.id })}
                    title={'Edit tableView ' + tableView.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete tableView ' + tableView.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(tableView.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableViewsList
