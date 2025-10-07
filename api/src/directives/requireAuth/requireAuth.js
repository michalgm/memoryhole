import gql from 'graphql-tag'

import { createValidatorDirective } from '@redwoodjs/graphql-server'

import { requireAuth as applicationRequireAuth } from 'src/lib/auth'

export const schema = gql`
  """
  Use to check whether or not a user is authenticated and is associated
  with an optional roles.
  """
  directive @requireAuth(minRole: String) on FIELD_DEFINITION
`

const validate = ({ directiveArgs }) => {
  const { minRole } = directiveArgs
  applicationRequireAuth({ minRole })
}

const requireAuth = createValidatorDirective(schema, validate)

export default requireAuth
