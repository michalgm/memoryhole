export const schema = gql`
  type SiteSetting {
    id: String!
    description: String
    value: JSON!
  }

  type Query {
    siteSettings: [SiteSetting!]! @requireAuth
    siteSetting(id: String!): SiteSetting @requireAuth
  }

  input CreateSiteSettingInput {
    description: String
    value: JSON!
  }

  input UpdateSiteSettingInput {
    description: String
    value: JSON
  }

  type Mutation {
    createSiteSetting(input: CreateSiteSettingInput!): SiteSetting! @requireAuth
    updateSiteSetting(
      id: String!
      input: UpdateSiteSettingInput!
    ): SiteSetting! @requireAuth
    deleteSiteSetting(id: String!): SiteSetting! @requireAuth
  }
`
