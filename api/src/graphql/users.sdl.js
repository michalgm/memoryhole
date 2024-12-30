export const schema = gql`
  type User {
    id: Int!
    email: String!
    name: String!
    custom_fields: JSON
    role: String!
    # hashedPassword: String
    # salt: String
    expiresAt: DateTime
    # resetToken: String
    # resetTokenExpiresAt: DateTime
    arrest_date_min: DateTime
    arrest_date_max: DateTime
    arrest_date_threshold: Int
    action_ids: [Int]
    created_arrests: [Arrest]!
    updated_arrests: [Arrest]!
    created_arrestees: [Arrestee]!
    updated_arrestees: [Arrestee]!
    updated_custom_schemas: [CustomSchema]!
    created_hotline_logs: [HotlineLog]!
    updated_hotline_logs: [HotlineLog]!
    created_arrestee_logs: [Log]!
    updated_arrestee_logs: [Log]!
    created_table_views: [TableView]!
    updated_table_views: [TableView]!
    actions: [Action]!
  }

  type Query {
    users: [User!]! @requireAuth
    searchUsers(search: String!): [User!]! @requireAuth
    user(id: Int!): User @requireAuth
  }

  input CreateUserInput {
    email: String!
    name: String!
    custom_fields: JSON
    role: String!
    # hashedPassword: String
    # salt: String
    expiresAt: DateTime
    # resetToken: String
    # resetTokenExpiresAt: DateTime
    arrest_date_min: DateTime
    arrest_date_max: DateTime
    arrest_date_threshold: Int
    action_ids: [Int]
  }

  input UpdateUserInput {
    email: String
    name: String
    custom_fields: JSON
    role: String
    # hashedPassword: String
    # salt: String
    expiresAt: DateTime
    # resetToken: String
    # resetTokenExpiresAt: DateTime
    arrest_date_min: DateTime
    arrest_date_max: DateTime
    arrest_date_threshold: Int
    action_ids: [Int]
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
      @requireAuth(roles: ["Admin", "Coordinator"])
    updateUser(id: Int!, input: UpdateUserInput!): User!
      @requireAuth(roles: ["Admin", "Coordinator"])
    deleteUser(id: Int!): User! @requireAuth(roles: ["Admin", "Coordinator"])
    bulkUpdateUsers(ids: [Int]!, input: UpdateUserInput): BatchPayload
      @requireAuth(roles: ["Admin", "Coordinator"])
    # emailUser(id: String!): User! @requireAuth
  }
`
