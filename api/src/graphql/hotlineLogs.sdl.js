export const schema = gql`
  type HotlineLog {
    id: Int!
    start_time: DateTime!
    end_time: DateTime!
    type: String
    notes: String
    notes_raw: String
    custom_fields: JSON
    created_at: DateTime
    created_by_id: Int
    updated_at: DateTime
    updated_by_id: Int
    created_by: User
    updated_by: User
  }

  type Query {
    hotlineLogs: [HotlineLog!]! @requireAuth
    hotlineLog(id: Int!): HotlineLog @requireAuth
  }

  input CreateHotlineLogInput {
    start_time: DateTime!
    end_time: DateTime!
    type: String
    notes: String
    notes_raw: String
    custom_fields: JSON
    created_at: DateTime
    created_by_id: Int
    updated_at: DateTime
    updated_by_id: Int
  }

  input UpdateHotlineLogInput {
    start_time: DateTime
    end_time: DateTime
    type: String
    notes: String
    notes_raw: String
    custom_fields: JSON
    created_at: DateTime
    created_by_id: Int
    updated_at: DateTime
    updated_by_id: Int
  }

  type Mutation {
    createHotlineLog(input: CreateHotlineLogInput!): HotlineLog! @requireAuth
    updateHotlineLog(id: Int!, input: UpdateHotlineLogInput!): HotlineLog!
      @requireAuth
    deleteHotlineLog(id: Int!): HotlineLog! @requireAuth
  }
`
