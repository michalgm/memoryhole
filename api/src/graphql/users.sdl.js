export const schema = gql`
  enum UserRole {
    Admin
    Coordinator
    Operator
    Restricted
  }

  type User {
    id: Int!
    email: String!
    name: String!
    custom_fields: JSON
    role: UserRole!
    # hashedPassword: String
    # salt: String
    expiresAt: DateTime
    # resetToken: String
    # resetTokenExpiresAt: DateTime
    access_date_min: DateTime
    access_date_max: DateTime
    access_date_threshold: Int
    action_ids: [Int]
    created_arrests: [Arrest]!
    updated_arrests: [Arrest]!
    created_arrestees: [Arrestee]!
    updated_arrestees: [Arrestee]!
    updated_custom_schemas: [CustomSchema]!
    # created_hotline_logs: [HotlineLog]!
    # updated_hotline_logs: [HotlineLog]!
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
    access_date_min: DateTime
    access_date_max: DateTime
    access_date_threshold: Int
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
    access_date_min: DateTime
    access_date_max: DateTime
    access_date_threshold: Int
    action_ids: [Int]
  }

  input ChangePasswordInput {
    currentPassword: String!
    newPassword: String!
  }

  type ChangePasswordPayload {
    success: Boolean!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
      @requireAuth(minRole: "Coordinator")
    updateUser(id: Int!, input: UpdateUserInput!): User!
      @requireAuth(minRole: "Operator")
    deleteUser(id: Int!): User! @requireAuth(minRole: "Coordinator")
    bulkUpdateUsers(ids: [Int]!, input: UpdateUserInput): BatchPayload
      @requireAuth(minRole: "Coordinator")
    changePassword(input: ChangePasswordInput!): ChangePasswordPayload!
      @requireAuth(minRole: "Operator")
    # emailUser(id: String!): User! @requireAuth
  }
`
