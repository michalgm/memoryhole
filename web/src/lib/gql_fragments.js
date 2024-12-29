import gql from 'graphql-tag'

import { registerFragment } from '@redwoodjs/web/apollo'

registerFragment(gql`
  fragment LogFields on Log {
    id
    type
    notes
    needs_followup
    arrests {
      id
      arrestee {
        id
        search_display_field
      }
      arrest_city
      date
    }
    action {
      id
      name
      start_date
    }
    created_at
    created_by {
      name
    }
    updated_at
    updated_by {
      name
    }
  }
`)

export const mockMutation = gql`
  mutation NoOp {
    __typename
  }
`
export const mockQuery = gql`
  query NoOpQuery {
    __typename
  }
`
