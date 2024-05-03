import { Link, routes } from '@redwoodjs/router'

import TableViews from 'src/components/TableView/TableViews'

export const QUERY = gql`
  query FindTableViews {
    tableViews {
      id
      name
      state
      type
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
      {'No tableViews yet. '}
      <Link to={routes.newTableView()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ tableViews }) => {
  return <TableViews tableViews={tableViews} />
}
