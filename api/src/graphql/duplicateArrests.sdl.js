export const schema = gql`
  type duplicateArrest {
    arrest1_id: Int!
    arrest2_id: Int!
    matchScore: Float!
    nameScore: Float!
    dobScore: Float!
    emailScore: Float!
    phoneScore: Float!
    dateProximityScore: Float!
    arrest1: Arrest!
    arrest2: Arrest!
  }

  type IgnoredDuplicate {
    id: Int!
    arrest1_id: Int!
    arrest2_id: Int!
    created_at: DateTime!
    created_by: User!
    arrest2: Arrest!
    arrest1: Arrest!
  }

  type Mutation {
    createIgnoredDuplicateArrest(arrest1_id: Int!, arrest2_id: Int!): IgnoredDuplicate! @requireAuth
    unIgnoreDuplicateArrest(arrest1_id: Int!, arrest2_id: Int!): IgnoredDuplicate! @requireAuth
  }
`
