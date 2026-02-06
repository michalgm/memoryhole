export const schema = gql`
  input QueryParams {
    where: JSON
    orderBy: JSON
    select: JSON
    take: Int
    skip: Int
  }
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
    shift: JSON
    contact: String
    action: Action
    action_id: Int
  }

  type Query {
    arresteeLogs(arrestee_id: Int): [Log!]! @requireAuth
    logs(params: QueryParams): [Log!]! @requireAuth #FIXME
    log(id: Int!): Log @requireAuth
  }

  input CreateLogInput {
    time: DateTime!
    type: String
    notes: String
    needs_followup: Boolean
    custom_fields: JSON
    created_by_id: Int
    updated_by_id: Int
    action_id: Int
    arrests: [Int]
    shift: JSON
    contact: String
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
    shift: JSON
    contact: String
  }

  type Mutation {
    createLog(input: CreateLogInput!): Log! @requireAuth
    updateLog(id: Int!, input: UpdateLogInput!): Log! @requireAuth
    deleteLog(id: Int!): Log! @requireAuth
  }
`
