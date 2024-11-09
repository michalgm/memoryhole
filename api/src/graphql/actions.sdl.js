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
  }

  type Query {
    actions: [Action!]! @requireAuth
    action(id: Int!): Action @requireAuth
  }

  input CreateActionInput {
    name: String!
    description: String
    start_date: DateTime!
    end_date: DateTime
    jurisdiction: String
    city: String
    custom_fields: JSON
  }

  input UpdateActionInput {
    name: String
    description: String
    start_date: DateTime
    end_date: DateTime
    jurisdiction: String
    city: String
    custom_fields: JSON
  }

  type Mutation {
    createAction(input: CreateActionInput!): Action! @requireAuth
    updateAction(id: Int!, input: UpdateActionInput!): Action! @requireAuth
    deleteAction(id: Int!): Action! @requireAuth
  }
`
