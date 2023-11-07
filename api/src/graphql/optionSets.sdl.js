export const schema = gql`
  type OptionSet {
    id: Int!
    name: String!
    description: String
    values: [OptionSetValue]!
  }

  type Query {
    optionSets: [OptionSet!]! @requireAuth
    optionSet(id: Int!): OptionSet @requireAuth
  }

  input CreateOptionSetInputValueInput {
    label: String!
    value: String!
  }

  input CreateOptionSetInput {
    name: String!
    values: [CreateOptionSetInputValueInput]!
  }

  input UpdateOptionSetInput {
    name: String
    values: [CreateOptionSetValueInput]!
  }

  type Mutation {
    createOptionSet(input: CreateOptionSetInput!): OptionSet! @requireAuth
    updateOptionSet(id: Int!, input: UpdateOptionSetInput!): OptionSet!
      @requireAuth
    deleteOptionSet(id: Int!): OptionSet! @requireAuth
  }
`
