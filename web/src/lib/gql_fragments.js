import gql from 'graphql-tag'

import { registerFragments } from '@redwoodjs/graphql-server'

registerFragments(gql`
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
