import { Link, routes } from '@redwoodjs/router'

import Arrests from 'src/components/Arrest/Arrests'

export const QUERY = gql`
  query FindArrests {
    arrests {
      id
      display_field
      search_field
      date
      location
      charges
      arrest_city
      jurisdiction
      citation_number
      arrestee_id
      custom_fields
      createdAt
      createdby_id
      updatedAt
      updatedby_id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No arrests yet. '}
      <Link to={routes.newArrest()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ arrests }) => {
  return <Arrests arrests={arrests} />
}
