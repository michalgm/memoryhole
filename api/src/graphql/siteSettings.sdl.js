export const schema = gql`
  type SiteSetting {
    id: String!
    description: String
    value: JSON!
    updated_at: DateTime
    updated_by: User
    updated_by_id: Int
  }

  type Query {
    siteSettings(ids: [String]): [SiteSetting] @requireAuth
    siteSetting(id: String!): SiteSetting @requireAuth
  }

  input CreateSiteSettingInput {
    id: String!
    description: String
    value: JSON!
  }

  input UpdateSiteSettingInput {
    description: String
    value: JSON
  }
  extend type Mutation {
    createSiteSetting(input: CreateSiteSettingInput!): SiteSetting! @requireAuth
    upsertSiteSetting(input: CreateSiteSettingInput!): SiteSetting! @requireAuth
    bulkUpsertSiteSetting(input: [CreateSiteSettingInput]!): [SiteSetting]!
      @requireAuth
    updateSiteSetting(
      id: String!
      input: UpdateSiteSettingInput!
    ): SiteSetting! @requireAuth
    deleteSiteSetting(id: String!): SiteSetting! @requireAuth
  }
`
