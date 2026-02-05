export const schema = gql`
  type OptionSet {
    id: Int!
    name: String!
    description: String
    values: [OptionSetValue]
  }

  type Query {
    optionSets: [OptionSet!]! @requireAuth
    optionSet(id: Int!): OptionSet @requireAuth
  }

  input CreateOptionSetInputValueInput {
    label: String!
    value: String!
    is_static: Boolean
    order: Int
  }

  input UpdateOptionSetInputValueInput {
    id: Int
    label: String
    value: String
    is_static: Boolean
    order: Int
    deleted: Boolean
  }

  input CreateOptionSetInput {
    name: String!
    values: [CreateOptionSetInputValueInput]!
  }

  input UpdateOptionSetInput {
    name: String
    values: [UpdateOptionSetInputValueInput]!
  }

  type Mutation {
    createOptionSet(input: CreateOptionSetInput!): OptionSet! @requireAuth
    updateOptionSetValues(id: Int!, input: UpdateOptionSetInput!): OptionSet!
      @requireAuth
    deleteOptionSet(id: Int!): OptionSet! @requireAuth
  }
`
