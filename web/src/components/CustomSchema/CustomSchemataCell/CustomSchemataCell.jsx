import { Link, routes } from '@cedarjs/router'

import CustomSchemata from 'src/components/CustomSchema/CustomSchemata'

export const QUERY = gql`
  query FindCustomSchemata {
    customSchemata {
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

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No customSchemata yet. '}
      <Link to={routes.newCustomSchema()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ customSchemata }) => {
  return <CustomSchemata customSchemata={customSchemata} />
}
