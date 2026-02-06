import { Link, navigate, routes } from '@cedarjs/router'
import { jsonDisplay, timeTag } from 'src/lib/formatters'

import { toast } from '@cedarjs/web/toast'
import { useMutation } from '@cedarjs/web'

const DELETE_CUSTOM_SCHEMA_MUTATION = gql`
  mutation DeleteCustomSchemaMutation($id: Int!) {
    deleteCustomSchema(id: $id) {
      id
    }
  }
`

const CustomSchema = ({ customSchema }) => {
  const [deleteCustomSchema] = useMutation(DELETE_CUSTOM_SCHEMA_MUTATION, {
    onCompleted: () => {
      toast.success('CustomSchema deleted')
      navigate(routes.customSchemata())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete customSchema ' + id + '?')) {
      deleteCustomSchema({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            CustomSchema {customSchema.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{customSchema.id}</td>
            </tr>
            <tr>
              <th>Table</th>
              <td>{customSchema.table}</td>
            </tr>
            <tr>
              <th>Section</th>
              <td>{customSchema.section}</td>
            </tr>
            <tr>
              <th>Schema</th>
              <td>{jsonDisplay(customSchema.schema)}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(customSchema.updated_at)}</td>
            </tr>
            <tr>
              <th>Updatedby id</th>
              <td>{customSchema.updated_by_id}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editCustomSchema({ id: customSchema.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(customSchema.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default CustomSchema
