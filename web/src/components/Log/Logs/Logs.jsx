import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Log/LogsCell'
import {
  checkboxInputTag,
  jsonTruncate,
  timeTag,
  truncate,
} from 'src/lib/formatters'

const DELETE_LOG_MUTATION = gql`
  mutation DeleteLogMutation($id: Int!) {
    deleteLog(id: $id) {
      id
    }
  }
`

const LogsList = ({ logs }) => {
  const [deleteLog] = useMutation(DELETE_LOG_MUTATION, {
    onCompleted: () => {
      toast.success('Log deleted')
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
    if (confirm('Are you sure you want to delete log ' + id + '?')) {
      deleteLog({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Time</th>
            <th>Type</th>
            <th>Notes</th>
            <th>Needs followup</th>
            <th>Custom fields</th>
            <th>Arrestee id</th>
            <th>Created at</th>
            <th>Createdby id</th>
            <th>Updated at</th>
            <th>Updatedby id</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{truncate(log.id)}</td>
              <td>{timeTag(log.time)}</td>
              <td>{truncate(log.type)}</td>
              <td>{truncate(log.notes)}</td>
              <td>{checkboxInputTag(log.needs_followup)}</td>
              <td>{jsonTruncate(log.custom_fields)}</td>
              <td>{truncate(log.arrestee_id)}</td>
              <td>{timeTag(log.createdAt)}</td>
              <td>{truncate(log.createdby_id)}</td>
              <td>{timeTag(log.updatedAt)}</td>
              <td>{truncate(log.updatedby_id)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.log({ id: log.id })}
                    title={'Show log ' + log.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editLog({ id: log.id })}
                    title={'Edit log ' + log.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete log ' + log.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(log.id)}
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

export default LogsList
