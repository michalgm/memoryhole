import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Arrestee/ArresteesCell'
import { jsonTruncate, timeTag, truncate } from 'src/lib/formatters'

const DELETE_ARRESTEE_MUTATION = gql`
  mutation DeleteArresteeMutation($id: Int!) {
    deleteArrestee(id: $id) {
      id
    }
  }
`

const ArresteesList = ({ arrestees }) => {
  const [deleteArrestee] = useMutation(DELETE_ARRESTEE_MUTATION, {
    onCompleted: () => {
      toast.success('Arrestee deleted')
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
    if (confirm('Are you sure you want to delete arrestee ' + id + '?')) {
      deleteArrestee({ variables: { id } })
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
            <th>First name</th>
            <th>Last name</th>
            <th>Preferred name</th>
            <th>Pronoun</th>
            <th>Dob</th>
            <th>Email</th>
            <th>Phone 1</th>
            <th>Phone 2</th>
            <th>Address</th>
            <th>City</th>
            <th>State</th>
            <th>Zip</th>
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
          {arrestees.map((arrestee) => (
            <tr key={arrestee.id}>
              <td>{truncate(arrestee.id)}</td>
              <td>{truncate(arrestee.display_field)}</td>
              <td>{truncate(arrestee.search_field)}</td>
              <td>{truncate(arrestee.first_name)}</td>
              <td>{truncate(arrestee.last_name)}</td>
              <td>{truncate(arrestee.preferred_name)}</td>
              <td>{truncate(arrestee.pronoun)}</td>
              <td>{timeTag(arrestee.dob)}</td>
              <td>{truncate(arrestee.email)}</td>
              <td>{truncate(arrestee.phone_1)}</td>
              <td>{truncate(arrestee.phone_2)}</td>
              <td>{truncate(arrestee.address)}</td>
              <td>{truncate(arrestee.city)}</td>
              <td>{truncate(arrestee.state)}</td>
              <td>{truncate(arrestee.zip)}</td>
              <td>{truncate(arrestee.notes)}</td>
              <td>{jsonTruncate(arrestee.custom_fields)}</td>
              <td>{timeTag(arrestee.createdAt)}</td>
              <td>{truncate(arrestee.createdby_id)}</td>
              <td>{timeTag(arrestee.updatedAt)}</td>
              <td>{truncate(arrestee.updatedby_id)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.arrestee({ id: arrestee.id })}
                    title={'Show arrestee ' + arrestee.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editArrestee({ id: arrestee.id })}
                    title={'Edit arrestee ' + arrestee.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete arrestee ' + arrestee.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(arrestee.id)}
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

export default ArresteesList
