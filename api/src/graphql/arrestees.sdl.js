export const schema = gql`
  type Arrestee {
    id: Int!
    display_field: String!
    search_field: String!
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
    createdAt: DateTime
    createdBy: User
    createdby_id: Int
    updatedAt: DateTime
    updatedBy: User
    updatedby_id: Int
    arrests: [Arrest]!
    arrestee_logs: [Log]!
  }

  type Query {
    arrestees: [Arrestee!]! @requireAuth
    arrestee(id: Int!): Arrestee @requireAuth
  }

  input CreateArresteeInput {
    display_field: String!
    search_field: String!
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
    createdby_id: Int
    updatedby_id: Int
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
    createdby_id: Int
    updatedby_id: Int
  }

  type Mutation {
    createArrestee(input: CreateArresteeInput!): Arrestee! @requireAuth
    updateArrestee(id: Int!, input: UpdateArresteeInput!): Arrestee!
      @requireAuth
    deleteArrestee(id: Int!): Arrestee! @requireAuth
  }
`
