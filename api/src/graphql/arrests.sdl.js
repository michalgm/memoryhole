export const schema = gql`
  input GenericFilterInput {
    field: String!
    value: JSON!
    operator: String # e.g., "eq", "ne", "lt", "gt", etc.
  }

  type Arrest {
    id: Int!
    display_field: String
    search_field: String
    date: DateTime
    location: String
    charges: String
    arrest_city: String
    jurisdiction: String
    citation_number: String
    arrestee: Arrestee
    arrestee_id: Int
    action: Action
    action_id: Int
    custom_fields: JSON
    created_at: DateTime
    created_by: User
    created_by_id: Int
    updated_at: DateTime
    updated_by: User
    updated_by_id: Int
  }

  type Query {
    arrests: [Arrest!]! @requireAuth
    arrest(id: Int!): Arrest @requireAuth
    searchArrestNames(search: String!): [Arrest!]! @requireAuth
    filterArrests(filters: [GenericFilterInput]): [Arrest]! @requireAuth
    docketSheetSearch(
      date: DateTime!
      days: Int!
      jurisdiction: String
      report_type: String!
      include_contact: Boolean
    ): [Arrest]! @requireAuth
  }

  input CreateArrestInput {
    display_field: String
    search_field: String
    date: DateTime
    location: String
    charges: String
    arrest_city: String
    jurisdiction: String
    citation_number: String
    arrestee_id: Int
    action_id: Int
    custom_fields: JSON
    created_by_id: Int
    updated_by_id: Int
    arrestee: UpdateArresteeInput
  }

  input UpdateArrestInput {
    display_field: String
    search_field: String
    date: DateTime
    location: String
    charges: String
    arrest_city: String
    jurisdiction: String
    citation_number: String
    arrestee_id: Int
    action_id: Int
    custom_fields: JSON
    created_by_id: Int
    updated_by_id: Int
    arrestee: UpdateArresteeInput
  }

  type BatchPayload {
    count: Int!
  }

  type Mutation {
    createArrest(input: CreateArrestInput!): Arrest! @requireAuth
    updateArrest(id: Int!, input: UpdateArrestInput!): Arrest! @requireAuth
    deleteArrest(id: Int!): Arrest! @requireAuth
    bulkUpdateArrests(ids: [Int]!, input: UpdateArrestInput): BatchPayload
      @requireAuth
    bulkDeleteArrests(ids: [Int]!): BatchPayload @requireAuth
  }
`
