export const schema = gql`
  input GenericFilterInput {
    field: String!
    value: JSON!
    operator: String # e.g., "eq", "ne", "lt", "gt", etc.
  }

  type Arrest {
    "Unique identifier for the arrest record"
    id: Int!
    "Formatted display name for UI presentation"
    display_field: String
    "Searchable text field for finding arrests"
    search_field: String
    "Date and time when the arrest occurred"
    date: DateTime
    "Physical location where arrest took place"
    location: String
    "List of charges filed"
    charges: String
    "City where arrest occurred"
    arrest_city: String
    "Legal jurisdiction handling the case"
    jurisdiction: String
    "Official citation or case number"
    citation_number: String
    "Arrestee record for the person arrested"
    arrestee: Arrestee
    "Foreign key linking to arrestee"
    arrestee_id: Int
    "Associated action record"
    action: Action
    "Foreign key linking to action"
    action_id: Int
    "Flexible field for additional data"
    custom_fields: JSON
    "Timestamp of record creation"
    created_at: DateTime
    "User who created the record"
    created_by: User
    "Foreign key linking to creating user"
    created_by_id: Int
    "Timestamp of last update"
    updated_at: DateTime
    "User who last updated the record"
    updated_by: User
    "Foreign key linking to updating user"
    updated_by_id: Int
    combined_notes: String
  }

  type Query {
    "Retrieve all accessible arrest records"
    arrests: [Arrest!]! @requireAuth

    "Get a single arrest record by ID"
    arrest(id: Int!): Arrest @requireAuth

    "Search arrests by name with optional query parameters"
    searchArrests(search: String, action_id: Int): [Arrest!]! @requireAuth

    "Filter arrests using flexible criteria"
    filterArrests(filters: [GenericFilterInput]): [Arrest]! @requireAuth

    "Search arrests within a date range for docket sheet generation"
    docketSheetSearch(
      date: DateTime!
      days: Int!
      jurisdiction: String
      arrest_city: String
      report_type: String!
      include_contact: Boolean
    ): [Arrest]! @requireAuth

    duplicateArrests(
      strictCityMatch: Boolean
      strictDOBMatch: Boolean
      includeIgnored: Boolean
      maxArrestDateDifferenceSeconds: Int
    ): [duplicateArrest!]! @requireAuth
  }

  "Creates a new arrest and arrestee"
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
    arrestee: CreateArresteeInput
  }

  type BatchPayload {
    count: Int!
  }

  type Mutation {
    "Create a new arrest record with optional arrestee details"
    createArrest(input: CreateArrestInput!): Arrest! @requireAuth

    "Update an existing arrest record"
    updateArrest(id: Int!, input: UpdateArrestInput!): Arrest! @requireAuth

    "Remove an arrest record and its arrestee"
    deleteArrest(id: Int!): Arrest! @requireAuth

    "Update multiple arrest records simultaneously"
    bulkUpdateArrests(ids: [Int]!, input: UpdateArrestInput): BatchPayload
      @requireAuth

    "Remove multiple arrest records simultaneously (along with their arrestee records"
    bulkDeleteArrests(ids: [Int]!): BatchPayload @requireAuth

    mergeArrests(id: Int!, input: UpdateArrestInput!, merge_id: Int!): Arrest!
      @requireAuth
  }
`
