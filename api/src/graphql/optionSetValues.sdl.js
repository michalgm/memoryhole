export const schema = gql`
  type OptionSetValue {
    id: Int!
    option_set_id: Int!
    label: String!
    value: String!
    is_static: Boolean!
    order: Int!
    option_set_details: OptionSet!
  }

  type Query {
    optionSetValues: [OptionSetValue!]! @requireAuth
    optionSetValue(id: Int!): OptionSetValue @requireAuth
  }

  input CreateOptionSetValueInput {
    option_set_id: Int!
    label: String!
    value: String!
    is_static: Boolean
    order: Int!
  }

  input UpdateOptionSetValueInput {
    option_set_id: Int
    label: String
    value: String
    is_static: Boolean
    order: Int
  }

  type Mutation {
    createOptionSetValue(input: CreateOptionSetValueInput!): OptionSetValue!
      @requireAuth
    updateOptionSetValue(
      id: Int!
      input: UpdateOptionSetValueInput!
    ): OptionSetValue! @requireAuth
    deleteOptionSetValue(id: Int!): OptionSetValue! @requireAuth
  }
`
