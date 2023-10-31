import HotlineLog from 'src/components/HotlineLog/HotlineLog'

export const QUERY = gql`
  query FindHotlineLogById($id: Int!) {
    hotlineLog: hotlineLog(id: $id) {
      id
      time
      type
      notes
      custom_fields
      created_at
      created_by_id
      updated_at
      updated_by_id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>HotlineLog not found</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ hotlineLog }) => {
  return <HotlineLog hotlineLog={hotlineLog} />
}
