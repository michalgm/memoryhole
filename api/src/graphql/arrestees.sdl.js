export const schema = gql`
  type Arrestee {
    id: Int!
    display_field: String
    search_field: String
    first_name: String
    last_name: String
    preferred_name: String
    pronoun: String
    dob: DateTime
    email: String
    phone_1: String
    phone_2: String
    address: String
    city: String
    state: String
    zip: String
    notes: String
    custom_fields: JSON
    created_at: DateTime
    created_by: User
    created_by_id: Int
    updated_at: DateTime
    updated_by: User
    updated_by_id: Int
    arrests: [Arrest]!
    arrestee_logs: [Log]!
    search_display_field: String
  }

  type Query {
    arrestees: [Arrestee!]! @requireAuth
    arrestee(id: Int!): Arrestee @requireAuth
  }

  input CreateArresteeInput {
    display_field: String
    search_field: String
    first_name: String
    last_name: String
    preferred_name: String
    pronoun: String
    dob: DateTime
    email: String
    phone_1: String
    phone_2: String
    address: String
    city: String
    state: String
    zip: String
    notes: String
    custom_fields: JSON
    created_by_id: Int
    updated_by_id: Int
  }

  input UpdateArresteeInput {
    display_field: String
    search_field: String
    first_name: String
    last_name: String
    preferred_name: String
    pronoun: String
    dob: DateTime
    email: String
    phone_1: String
    phone_2: String
    address: String
    city: String
    state: String
    zip: String
    notes: String
    custom_fields: JSON
    created_by_id: Int
    updated_by_id: Int
  }

  type Mutation {
    createArrestee(input: CreateArresteeInput!): Arrestee! @requireAuth
    updateArrestee(id: Int!, input: UpdateArresteeInput!): Arrestee!
      @requireAuth
    deleteArrestee(id: Int!): Arrestee! @requireAuth
  }
`
