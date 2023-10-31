import { Link, routes } from '@redwoodjs/router'
import { jsonTruncate, timeTag, truncate } from 'src/lib/formatters'

import { QUERY } from 'src/components/HotlineLog/HotlineLogsCell'
import { toast } from '@redwoodjs/web/toast'
import { useMutation } from '@redwoodjs/web'

const DELETE_HOTLINE_LOG_MUTATION = gql`
  mutation DeleteHotlineLogMutation($id: Int!) {
    deleteHotlineLog(id: $id) {
      id
    }
  }
`

const HotlineLogsList = ({ hotlineLogs }) => {
  const [deleteHotlineLog] = useMutation(DELETE_HOTLINE_LOG_MUTATION, {
    onCompleted: () => {
      toast.success('HotlineLog deleted')
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
    if (confirm('Are you sure you want to delete hotlineLog ' + id + '?')) {
      deleteHotlineLog({ variables: { id } })
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
            <th>Custom fields</th>
            <th>Created at</th>
            <th>Createdby id</th>
            <th>Updated at</th>
            <th>Updatedby id</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {hotlineLogs.map((hotlineLog) => (
            <tr key={hotlineLog.id}>
              <td>{truncate(hotlineLog.id)}</td>
              <td>{timeTag(hotlineLog.time)}</td>
              <td>{truncate(hotlineLog.type)}</td>
              <td>{truncate(hotlineLog.notes)}</td>
              <td>{jsonTruncate(hotlineLog.custom_fields)}</td>
              <td>{timeTag(hotlineLog.created_at)}</td>
              <td>{truncate(hotlineLog.created_by_id)}</td>
              <td>{timeTag(hotlineLog.updated_at)}</td>
              <td>{truncate(hotlineLog.updated_by_id)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.hotlineLog({ id: hotlineLog.id })}
                    title={'Show hotlineLog ' + hotlineLog.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editHotlineLog({ id: hotlineLog.id })}
                    title={'Edit hotlineLog ' + hotlineLog.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete hotlineLog ' + hotlineLog.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(hotlineLog.id)}
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

export default HotlineLogsList
