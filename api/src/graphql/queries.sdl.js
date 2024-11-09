export const schema = gql`
  input QueryParams {
    where: JSON
    orderBy: JSON
    select: JSON
    take: Int
    skip: Int
  }

  type Query {
    dynamicModelQuery(model: String!, params: QueryParams!): JSON! @requireAuth
  }
`
