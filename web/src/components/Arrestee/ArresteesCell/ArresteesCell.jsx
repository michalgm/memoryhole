import { Link, routes } from '@redwoodjs/router'

import Arrestees from 'src/components/Arrestee/Arrestees'

export const QUERY = gql`
  query FindArrestees {
    arrestees {
      id
      display_field
      search_field
      first_name
      last_name
      preferred_name
      pronoun
      dob
      email
      phone_1
      phone_2
      address
      city
      state
      zip
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
      {'No arrestees yet. '}
      <Link to={routes.newArrestee()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ arrestees }) => {
  return <Arrestees arrestees={arrestees} />
}
