export const schema = gql`
  type HotlineLog {
    id: Int!
    time: DateTime!
    type: String
    notes: String
    custom_fields: JSON
    created_at: DateTime
    created_by: User
    created_by_id: Int
    updated_at: DateTime
    updated_by: User
    updated_by_id: Int
  }

  type Query {
    hotlineLogs: [HotlineLog!]! @requireAuth
    hotlineLog(id: Int!): HotlineLog @requireAuth
  }

  input CreateHotlineLogInput {
    time: DateTime!
    type: String
    notes: String
    custom_fields: JSON
    created_by_id: Int
    updated_by_id: Int
  }

  input UpdateHotlineLogInput {
    time: DateTime
    type: String
    notes: String
    custom_fields: JSON
    created_by_id: Int
    updated_by_id: Int
  }

  type Mutation {
    createHotlineLog(input: CreateHotlineLogInput!): HotlineLog! @requireAuth
    updateHotlineLog(id: Int!, input: UpdateHotlineLogInput!): HotlineLog!
      @requireAuth
    deleteHotlineLog(id: Int!): HotlineLog! @requireAuth
  }
`
