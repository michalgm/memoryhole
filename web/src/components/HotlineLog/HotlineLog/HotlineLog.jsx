import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { jsonDisplay, timeTag } from 'src/lib/formatters'

const DELETE_HOTLINE_LOG_MUTATION = gql`
  mutation DeleteHotlineLogMutation($id: Int!) {
    deleteHotlineLog(id: $id) {
      id
    }
  }
`

const HotlineLog = ({ hotlineLog }) => {
  const [deleteHotlineLog] = useMutation(DELETE_HOTLINE_LOG_MUTATION, {
    onCompleted: () => {
      toast.success('HotlineLog deleted')
      navigate(routes.hotlineLogs())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete hotlineLog ' + id + '?')) {
      deleteHotlineLog({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            HotlineLog {hotlineLog.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{hotlineLog.id}</td>
            </tr>
            <tr>
              <th>Time</th>
              <td>{timeTag(hotlineLog.time)}</td>
            </tr>
            <tr>
              <th>Type</th>
              <td>{hotlineLog.type}</td>
            </tr>
            <tr>
              <th>Notes</th>
              <td>{hotlineLog.notes}</td>
            </tr>
            <tr>
              <th>Custom fields</th>
              <td>{jsonDisplay(hotlineLog.custom_fields)}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(hotlineLog.createdAt)}</td>
            </tr>
            <tr>
              <th>Createdby id</th>
              <td>{hotlineLog.createdby_id}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(hotlineLog.updatedAt)}</td>
            </tr>
            <tr>
              <th>Updatedby id</th>
              <td>{hotlineLog.updatedby_id}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editHotlineLog({ id: hotlineLog.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(hotlineLog.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default HotlineLog
