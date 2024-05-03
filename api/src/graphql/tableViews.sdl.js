export const schema = gql`
  type TableView {
    id: Int!
    name: String!
    state: String!
    type: String!
    created_at: DateTime
    created_by_id: Int
    updated_at: DateTime
    updated_by_id: Int
    created_by: User
    updated_by: User
  }

  type Query {
    tableViews: [TableView!]! @requireAuth
    tableView(id: Int!): TableView @requireAuth
  }

  input CreateTableViewInput {
    name: String!
    state: String!
    type: String!
    created_at: DateTime
    created_by_id: Int
    updated_at: DateTime
    updated_by_id: Int
  }

  input UpdateTableViewInput {
    name: String
    state: String
    type: String
    created_at: DateTime
    created_by_id: Int
    updated_at: DateTime
    updated_by_id: Int
  }

  type Mutation {
    createTableView(input: CreateTableViewInput!): TableView! @requireAuth
    updateTableView(id: Int!, input: UpdateTableViewInput!): TableView!
      @requireAuth
    deleteTableView(id: Int!): TableView! @requireAuth
  }
`
