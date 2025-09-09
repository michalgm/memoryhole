import { useQuery } from '@apollo/client'

const QUERY_SETTINGS = gql`
  query SiteSettingsQuery($ids: [String]) {
    siteSettings(ids: $ids) {
      id
      value
    }
  }
`
export const transformSettings = (data) => {
  return (data?.siteSettings || []).reduce((acc, { id, value }) => {
    acc[id] = value
    return acc
  }, {})
}

export const useSiteSettings = (keys = null) => {
  const { data, loading, error, refetch } = useQuery(QUERY_SETTINGS, {
    variables: { ids: keys },
  })

  const settings = transformSettings(data)

  const wrappedRefetch = async () => {
    const { data } = await refetch()
    return transformSettings(data)
  }

  return {
    loading,
    error,
    settings,
    refetch: wrappedRefetch,
  }
}
