export const schema = gql`
  type User {
    id: Int!
    email: String!
    name: String!
    custom_fields: JSON
    role: String!
    hashedPassword: String
    salt: String
    resetToken: String
    resetTokenExpiresAt: DateTime
    created_arrests: [Arrest]!
    updated_arrests: [Arrest]!
    created_arrestees: [Arrestee]!
    updated_arrestees: [Arrestee]!
    created_arrestee_logs: [Log]!
    updated_arrestee_logs: [Log]!
    created_hotline_logs: [HotlineLog]!
    updated_hotline_logs: [HotlineLog]!
    updated_custom_schemas: [CustomSchema]!
  }

  type Query {
    users: [User!]! @requireAuth
    user(id: Int!): User @requireAuth
  }

  input CreateUserInput {
    email: String!
    name: String!
    custom_fields: JSON
    role: String!
    hashedPassword: String
    salt: String
    resetToken: String
    resetTokenExpiresAt: DateTime
  }

  input UpdateUserInput {
    email: String
    name: String
    custom_fields: JSON
    role: String
    hashedPassword: String
    salt: String
    resetToken: String
    resetTokenExpiresAt: DateTime
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: Int!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: Int!): User! @requireAuth
    emailUser(id: String!): User! @requireAuth
  }
`
