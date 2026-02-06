export const schema = gql`
  type Action {
    id: Int!
    name: String!
    description: String
    start_date: DateTime!
    end_date: DateTime
    jurisdiction: String
    city: String
    custom_fields: JSON
    Arrest: [Arrest]!
    arrests_count: Int
    logs_count: Int
    location: String
  }

  type Query {
    actions: [Action!]! @requireAuth
    action(id: Int!): Action @requireAuth
    searchActions(search: String): [Action!]! @requireAuth
  }

  input CreateActionInput {
    name: String!
    description: String
    start_date: DateTime!
    end_date: DateTime
    jurisdiction: String
    city: String
    custom_fields: JSON
    location: String
  }

  input UpdateActionInput {
    name: String
    description: String
    start_date: DateTime
    end_date: DateTime
    jurisdiction: String
    city: String
    custom_fields: JSON
    location: String
  }

  type Mutation {
    createAction(input: CreateActionInput!): Action! @requireAuth
    updateAction(id: Int!, input: UpdateActionInput!): Action! @requireAuth
    deleteAction(id: Int!, deleteRelations: Boolean): Action! @requireAuth
  }
`
