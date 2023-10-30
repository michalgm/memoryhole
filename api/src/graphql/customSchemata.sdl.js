export const schema = gql`
  type CustomSchema {
    id: Int!
    table: String!
    section: String!
    schema: JSON!
    updatedAt: DateTime
    updatedBy: User
    updatedby_id: Int
  }

  type Query {
    customSchemata: [CustomSchema!]! @requireAuth
    customSchema(id: Int!): CustomSchema @requireAuth
  }

  input CreateCustomSchemaInput {
    table: String!
    section: String!
    schema: JSON!
    updatedby_id: Int
  }

  input UpdateCustomSchemaInput {
    table: String
    section: String
    schema: JSON
    updatedby_id: Int
  }

  type Mutation {
    createCustomSchema(input: CreateCustomSchemaInput!): CustomSchema!
      @requireAuth
    updateCustomSchema(
      id: Int!
      input: UpdateCustomSchemaInput!
    ): CustomSchema! @requireAuth
    deleteCustomSchema(id: Int!): CustomSchema! @requireAuth
  }
`
