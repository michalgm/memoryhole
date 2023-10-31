import { Link, navigate, routes } from '@redwoodjs/router'
import { checkboxInputTag, jsonDisplay, timeTag } from 'src/lib/formatters'

import { toast } from '@redwoodjs/web/toast'
import { useMutation } from '@redwoodjs/web'

const DELETE_LOG_MUTATION = gql`
  mutation DeleteLogMutation($id: Int!) {
    deleteLog(id: $id) {
      id
    }
  }
`

const Log = ({ log }) => {
  const [deleteLog] = useMutation(DELETE_LOG_MUTATION, {
    onCompleted: () => {
      toast.success('Log deleted')
      navigate(routes.logs())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete log ' + id + '?')) {
      deleteLog({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Log {log.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{log.id}</td>
            </tr>
            <tr>
              <th>Time</th>
              <td>{timeTag(log.time)}</td>
            </tr>
            <tr>
              <th>Type</th>
              <td>{log.type}</td>
            </tr>
            <tr>
              <th>Notes</th>
              <td>{log.notes}</td>
            </tr>
            <tr>
              <th>Needs followup</th>
              <td>{checkboxInputTag(log.needs_followup)}</td>
            </tr>
            <tr>
              <th>Custom fields</th>
              <td>{jsonDisplay(log.custom_fields)}</td>
            </tr>
            <tr>
              <th>Arrestee id</th>
              <td>{log.arrestee_id}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(log.created_at)}</td>
            </tr>
            <tr>
              <th>Createdby id</th>
              <td>{log.created_by_id}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(log.updated_at)}</td>
            </tr>
            <tr>
              <th>Updatedby id</th>
              <td>{log.updated_by_id}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editLog({ id: log.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(log.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Log
