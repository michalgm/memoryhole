export const schema = gql`
  type Log {
    id: Int!
    time: DateTime!
    type: String
    notes: String
    needs_followup: Boolean!
    custom_fields: JSON
    arrestee: Arrestee
    arrestee_id: Int
    createdAt: DateTime
    createdBy: User
    createdby_id: Int
    updatedAt: DateTime
    updatedBy: User
    updatedby_id: Int
  }

  type Query {
    logs: [Log!]! @requireAuth
    log(id: Int!): Log @requireAuth
  }

  input CreateLogInput {
    time: DateTime!
    type: String
    notes: String
    needs_followup: Boolean!
    custom_fields: JSON
    arrestee_id: Int
    createdby_id: Int
    updatedby_id: Int
  }

  input UpdateLogInput {
    time: DateTime
    type: String
    notes: String
    needs_followup: Boolean
    custom_fields: JSON
    arrestee_id: Int
    createdby_id: Int
    updatedby_id: Int
  }

  type Mutation {
    createLog(input: CreateLogInput!): Log! @requireAuth
    updateLog(id: Int!, input: UpdateLogInput!): Log! @requireAuth
    deleteLog(id: Int!): Log! @requireAuth
  }
`
