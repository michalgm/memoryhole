import HotlineLogs from './HotlineLogs'
export const QUERY = gql`
  query HotlineLogsQuery {
    hotlineLogs {
      id
      start_time
      end_time
      notes
      custom_fields
      created_at
      created_by {
        name
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

// export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ hotlineLogs, queryResult }) => {
  const refetch = () =>
    queryResult.refetch({ variables: queryResult.variables })
  return <HotlineLogs hotlineLogs={hotlineLogs} refetch={refetch} />
}
