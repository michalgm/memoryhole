export const schema = gql`
  type Log {
    id: Int!
    time: DateTime!
    type: String
    notes: String
    needs_followup: Boolean!
    custom_fields: JSON
    created_at: DateTime
    created_by: User
    created_by_id: Int
    updated_at: DateTime
    updated_by: User
    updated_by_id: Int
    arrests: [Arrest]!
    action: Action
    action_id: Int
  }

  type Query {
    arresteeLogs(arrestee_id: Int): [Log!]! @requireAuth
    logs(params: QueryParams): [Log!]! @requireAuth
    log(id: Int!): Log @requireAuth
  }

  input CreateLogInput {
    type: String
    notes: String
    needs_followup: Boolean
    custom_fields: JSON
    created_by_id: Int
    updated_by_id: Int
    action_id: Int
    arrests: [Int]
  }

  input UpdateLogInput {
    time: DateTime
    type: String
    notes: String
    needs_followup: Boolean
    custom_fields: JSON
    created_by_id: Int
    updated_by_id: Int
    action_id: Int
    arrests: [Int]
  }

  type Mutation {
    createLog(input: CreateLogInput!): Log! @requireAuth
    updateLog(id: Int!, input: UpdateLogInput!): Log! @requireAuth
    deleteLog(id: Int!): Log! @requireAuth
  }
`
