export const schema = gql`
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
    custom_fields: JSON
    created_by_id: Int
    updated_by_id: Int
    arrestee: UpdateArresteeInput
  }

  type Mutation {
    createArrest(input: CreateArrestInput!): Arrest! @requireAuth
    updateArrest(id: Int!, input: UpdateArrestInput!): Arrest! @requireAuth
    deleteArrest(id: Int!): Arrest! @requireAuth
  }
`
