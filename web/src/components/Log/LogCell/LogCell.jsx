import Log from 'src/components/Log/Log'

export const QUERY = gql`
  query FindLogById($id: Int!) {
    log: log(id: $id) {
      id
      time
      type
      notes
      needs_followup
      custom_fields
      arrestee_id
      createdAt
      createdby_id
      updatedAt
      updatedby_id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Log not found</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ log }) => {
  return <Log log={log} />
}
