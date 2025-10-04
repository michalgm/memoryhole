import gql from 'graphql-tag'

import { registerFragment } from '@redwoodjs/web/apollo'

registerFragment(gql`
  fragment UserFields on User {
    id
    email
    name
    expiresAt
    role
    custom_fields
    access_date_max
    access_date_min
    access_date_threshold
    action_ids
    actions {
      id
      name
      start_date
    }
  }
`)

registerFragment(gql`
  fragment ActionFields on Action {
    id
    name
    description
    start_date
    end_date
    jurisdiction
    city
    arrests_count
    logs_count
  }
`)

registerFragment(gql`
  fragment ArrestFields on Arrest {
    id
    date
    location
    display_field
    search_field
    date
    charges
    arrest_city
    jurisdiction
    citation_number
    arrestee_id
    action_id
    combined_notes
    action {
      id
      name
      start_date
    }
    custom_fields
    created_at
    created_by {
      id
      name
    }
    updated_at
    updated_by {
      id
      name
    }
    arrestee {
      id
      display_field
      search_display_field
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
      custom_fields
      full_legal_name
    }
  }
`)

registerFragment(gql`
  fragment LogFields on Log {
    id
    type
    time
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
    shift
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

registerFragment(gql`
  fragment CollabDocumentFields on CollabDocument {
    id
    name
    title
    type
    html_content
    parent_id
    created_at
    updated_at
    created_by_id
    last_edited_by
    created_by {
      id
      name
      email
    }
    last_editor {
      id
      name
      email
    }
    parent {
      id
      title
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
