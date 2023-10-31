import { Link, routes } from '@redwoodjs/router'

import HotlineLogs from 'src/components/HotlineLog/HotlineLogs'

export const QUERY = gql`
  query FindHotlineLogs {
    hotlineLogs {
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

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No hotlineLogs yet. '}
      <Link to={routes.newHotlineLog()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ hotlineLogs }) => {
  return <HotlineLogs hotlineLogs={hotlineLogs} />
}
