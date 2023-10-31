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
      created_at
      created_by_id
      updated_at
      updated_by_id
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
