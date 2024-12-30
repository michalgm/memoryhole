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

  input UpsertSiteSettingInput {
    id: String
    description: String
    value: JSON!
  }

  input UpdateSiteSettingInput {
    description: String
    value: JSON!
  }

  extend type Mutation {
    createSiteSetting(input: CreateSiteSettingInput!): SiteSetting! @requireAuth
    upsertSiteSetting(input: UpsertSiteSettingInput!): SiteSetting! @requireAuth
    updateSiteSetting(
      id: String!
      input: UpdateSiteSettingInput!
    ): SiteSetting! @requireAuth
    bulkUpsertSiteSetting(input: [UpsertSiteSettingInput]!): [SiteSetting]!
      @requireAuth
    deleteSiteSetting(id: String!): SiteSetting! @requireAuth
  }
`
