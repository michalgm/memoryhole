import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { jsonDisplay, timeTag } from 'src/lib/formatters'

const DELETE_ARRESTEE_MUTATION = gql`
  mutation DeleteArresteeMutation($id: Int!) {
    deleteArrestee(id: $id) {
      id
    }
  }
`

const Arrestee = ({ arrestee }) => {
  const [deleteArrestee] = useMutation(DELETE_ARRESTEE_MUTATION, {
    onCompleted: () => {
      toast.success('Arrestee deleted')
      navigate(routes.arrestees())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete arrestee ' + id + '?')) {
      deleteArrestee({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Arrestee {arrestee.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{arrestee.id}</td>
            </tr>
            <tr>
              <th>Display field</th>
              <td>{arrestee.display_field}</td>
            </tr>
            <tr>
              <th>Search field</th>
              <td>{arrestee.search_field}</td>
            </tr>
            <tr>
              <th>First name</th>
              <td>{arrestee.first_name}</td>
            </tr>
            <tr>
              <th>Last name</th>
              <td>{arrestee.last_name}</td>
            </tr>
            <tr>
              <th>Preferred name</th>
              <td>{arrestee.preferred_name}</td>
            </tr>
            <tr>
              <th>Pronoun</th>
              <td>{arrestee.pronoun}</td>
            </tr>
            <tr>
              <th>Dob</th>
              <td>{timeTag(arrestee.dob)}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{arrestee.email}</td>
            </tr>
            <tr>
              <th>Phone 1</th>
              <td>{arrestee.phone_1}</td>
            </tr>
            <tr>
              <th>Phone 2</th>
              <td>{arrestee.phone_2}</td>
            </tr>
            <tr>
              <th>Address</th>
              <td>{arrestee.address}</td>
            </tr>
            <tr>
              <th>City</th>
              <td>{arrestee.city}</td>
            </tr>
            <tr>
              <th>State</th>
              <td>{arrestee.state}</td>
            </tr>
            <tr>
              <th>Zip</th>
              <td>{arrestee.zip}</td>
            </tr>
            <tr>
              <th>Notes</th>
              <td>{arrestee.notes}</td>
            </tr>
            <tr>
              <th>Custom fields</th>
              <td>{jsonDisplay(arrestee.custom_fields)}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(arrestee.createdAt)}</td>
            </tr>
            <tr>
              <th>Createdby id</th>
              <td>{arrestee.createdby_id}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(arrestee.updatedAt)}</td>
            </tr>
            <tr>
              <th>Updatedby id</th>
              <td>{arrestee.updatedby_id}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editArrestee({ id: arrestee.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(arrestee.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Arrestee
