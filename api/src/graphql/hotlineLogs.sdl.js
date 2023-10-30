export const schema = gql`
  type HotlineLog {
    id: Int!
    time: DateTime!
    type: String
    notes: String
    custom_fields: JSON
    createdAt: DateTime
    createdBy: User
    createdby_id: Int
    updatedAt: DateTime
    updatedBy: User
    updatedby_id: Int
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
    createdby_id: Int
    updatedby_id: Int
  }

  input UpdateHotlineLogInput {
    time: DateTime
    type: String
    notes: String
    custom_fields: JSON
    createdby_id: Int
    updatedby_id: Int
  }

  type Mutation {
    createHotlineLog(input: CreateHotlineLogInput!): HotlineLog! @requireAuth
    updateHotlineLog(id: Int!, input: UpdateHotlineLogInput!): HotlineLog!
      @requireAuth
    deleteHotlineLog(id: Int!): HotlineLog! @requireAuth
  }
`
