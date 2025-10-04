export const schema = gql`
  type CollabDocument {
    id: String!
    name: String!
    title: String
    type: String!
    html_content: String
    parent_id: String
    created_at: DateTime!
    updated_at: DateTime!
    created_by_id: Int!
    last_edited_by: Int
    created_by: User!
    last_editor: User
    parent: CollabDocument
    children: [CollabDocument]!
  }

  type Query {
    collabDocuments: [CollabDocument!]! @requireAuth
    collabDocument(id: String): CollabDocument @requireAuth
  }
`
