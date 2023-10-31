import { Link, navigate, routes } from '@redwoodjs/router'
import { jsonDisplay, timeTag } from 'src/lib/formatters'

import { toast } from '@redwoodjs/web/toast'
import { useMutation } from '@redwoodjs/web'

const DELETE_ARREST_MUTATION = gql`
  mutation DeleteArrestMutation($id: Int!) {
    deleteArrest(id: $id) {
      id
    }
  }
`

const Arrest = ({ arrest }) => {
  const [deleteArrest] = useMutation(DELETE_ARREST_MUTATION, {
    onCompleted: () => {
      toast.success('Arrest deleted')
      navigate(routes.arrests())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete arrest ' + id + '?')) {
      deleteArrest({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Arrest {arrest.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{arrest.id}</td>
            </tr>
            <tr>
              <th>Display field</th>
              <td>{arrest.display_field}</td>
            </tr>
            <tr>
              <th>Search field</th>
              <td>{arrest.search_field}</td>
            </tr>
            <tr>
              <th>Date</th>
              <td>{timeTag(arrest.date)}</td>
            </tr>
            <tr>
              <th>Location</th>
              <td>{arrest.location}</td>
            </tr>
            <tr>
              <th>Charges</th>
              <td>{arrest.charges}</td>
            </tr>
            <tr>
              <th>Arrest city</th>
              <td>{arrest.arrest_city}</td>
            </tr>
            <tr>
              <th>Jurisdiction</th>
              <td>{arrest.jurisdiction}</td>
            </tr>
            <tr>
              <th>Citation number</th>
              <td>{arrest.citation_number}</td>
            </tr>
            <tr>
              <th>Arrestee id</th>
              <td>{arrest.arrestee_id}</td>
            </tr>
            <tr>
              <th>Custom fields</th>
              <td>{jsonDisplay(arrest.custom_fields)}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(arrest.created_at)}</td>
            </tr>
            <tr>
              <th>Createdby id</th>
              <td>{arrest.created_by_id}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(arrest.updated_at)}</td>
            </tr>
            <tr>
              <th>Updatedby id</th>
              <td>{arrest.updated_by_id}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editArrest({ id: arrest.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(arrest.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Arrest
