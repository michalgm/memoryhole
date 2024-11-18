import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Arrest/ArrestsCell'
import { jsonTruncate, timeTag, truncate } from 'src/lib/formatters'

const DELETE_ARREST_MUTATION = gql`
  mutation DeleteArrestMutation($id: Int!) {
    deleteArrest(id: $id) {
      id
    }
  }
`

const ArrestsList = ({ arrests }) => {
  const [deleteArrest] = useMutation(DELETE_ARREST_MUTATION, {
    onCompleted: () => {
      toast.success('Arrest deleted')
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
    if (confirm('Are you sure you want to delete arrest ' + id + '?')) {
      deleteArrest({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Display field</th>
            <th>Search field</th>
            <th>Date</th>
            <th>Location</th>
            <th>Charges</th>
            <th>Arrest city</th>
            <th>Jurisdiction</th>
            <th>Citation number</th>
            <th>Arrestee id</th>
            <th>Custom fields</th>
            <th>Created at</th>
            <th>Createdby id</th>
            <th>Updated at</th>
            <th>Updatedby id</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {arrests.map((arrest) => (
            <tr key={arrest.id}>
              <td>{truncate(arrest.id)}</td>
              <td>{truncate(arrest.display_field)}</td>
              <td>{truncate(arrest.search_field)}</td>
              <td>{timeTag(arrest.date)}</td>
              <td>{truncate(arrest.location)}</td>
              <td>{truncate(arrest.charges)}</td>
              <td>{truncate(arrest.arrest_city)}</td>
              <td>{truncate(arrest.jurisdiction)}</td>
              <td>{truncate(arrest.citation_number)}</td>
              <td>{truncate(arrest.arrestee_id)}</td>
              <td>{jsonTruncate(arrest.custom_fields)}</td>
              <td>{timeTag(arrest.created_at)}</td>
              <td>{truncate(arrest.created_by_id)}</td>
              <td>{timeTag(arrest.updated_at)}</td>
              <td>{truncate(arrest.updated_by_id)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.arrest({ id: arrest.id })}
                    title={'Show arrest ' + arrest.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editArrest({ id: arrest.id })}
                    title={'Edit arrest ' + arrest.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete arrest ' + arrest.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(arrest.id)}
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

export default ArrestsList
