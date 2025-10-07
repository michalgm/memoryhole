export const schema = gql`
  type Document {
    id: String!
    name: String!
    title: String
    type: String!
    html_content: String
    parent_id: String
    created_at: DateTime!
    updated_at: DateTime!
    created_by_id: Int!
    updated_by_id: Int
    created_by: User!
    updated_by: User
    parent: Document
    children: [Document]!
    access_role: UserRole!
    edit_role: UserRole!
  }

  type Query {
    documents: [Document!]! @requireAuth(minRole: "Restricted")
    document(id: String): Document @requireAuth(minRole: "Restricted")
  }

  input UpdateDocumentInput {
    name: String
    title: String
    type: String
    access_role: UserRole
    edit_role: UserRole
  }

  input CreateDocumentInput {
    title: String!
    type: String!
    access_role: UserRole
    edit_role: UserRole
  }

  extend type Mutation {
    updateDocument(id: String!, input: UpdateDocumentInput!): Document!
      @requireAuth
    createDocument(input: CreateDocumentInput!): Document! @requireAuth
    deleteDocument(id: String!): Document! @requireAuth
  }
`
