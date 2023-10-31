import CustomSchema from 'src/components/CustomSchema/CustomSchema'

export const QUERY = gql`
  query FindCustomSchemaById($id: Int!) {
    customSchema: customSchema(id: $id) {
      id
      table
      section
      schema
      updated_at
      updated_by_id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>CustomSchema not found</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ customSchema }) => {
  return <CustomSchema customSchema={customSchema} />
}
