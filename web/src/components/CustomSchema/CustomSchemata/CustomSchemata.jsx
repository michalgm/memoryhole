import { Link, routes } from '@redwoodjs/router'
import { jsonTruncate, timeTag, truncate } from 'src/lib/formatters'

import { QUERY } from 'src/components/CustomSchema/CustomSchemataCell'
import { toast } from '@redwoodjs/web/toast'
import { useMutation } from '@redwoodjs/web'

const DELETE_CUSTOM_SCHEMA_MUTATION = gql`
  mutation DeleteCustomSchemaMutation($id: Int!) {
    deleteCustomSchema(id: $id) {
      id
    }
  }
`

const CustomSchemataList = ({ customSchemata }) => {
  const [deleteCustomSchema] = useMutation(DELETE_CUSTOM_SCHEMA_MUTATION, {
    onCompleted: () => {
      toast.success('CustomSchema deleted')
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
    if (confirm('Are you sure you want to delete customSchema ' + id + '?')) {
      deleteCustomSchema({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Table</th>
            <th>Section</th>
            <th>Schema</th>
            <th>Updated at</th>
            <th>Updatedby id</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {customSchemata.map((customSchema) => (
            <tr key={customSchema.id}>
              <td>{truncate(customSchema.id)}</td>
              <td>{truncate(customSchema.table)}</td>
              <td>{truncate(customSchema.section)}</td>
              <td>{jsonTruncate(customSchema.schema)}</td>
              <td>{timeTag(customSchema.updated_at)}</td>
              <td>{truncate(customSchema.updated_by_id)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.customSchema({ id: customSchema.id })}
                    title={'Show customSchema ' + customSchema.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editCustomSchema({ id: customSchema.id })}
                    title={'Edit customSchema ' + customSchema.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete customSchema ' + customSchema.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(customSchema.id)}
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

export default CustomSchemataList
