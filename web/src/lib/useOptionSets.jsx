import { useQuery } from '@apollo/client'

import { useAuth } from '../auth'

const QUERY_OPTION_SETS = gql`
  query OptionSetsQuery {
    optionSets {
      name
      values {
        label
        value
      }
    }
  }
`

export const transformOptionSets = (data) => {
  return (data?.optionSets || []).reduce((acc, optionSet) => {
    acc[optionSet.name] = (optionSet.values || []).map((v) => ({
      ...v,
      id: v.value, // Use value as id for selects
    }))
    return acc
  }, {})
}

export const useOptionSets = () => {
  const { isAuthenticated } = useAuth()
  const { data, loading, error, refetch } = useQuery(QUERY_OPTION_SETS, {
    skip: !isAuthenticated,
  })

  const optionSets = transformOptionSets(data)
  const wrappedRefetch = async () => {
    const { data } = await refetch()
    return transformOptionSets(data)
  }

  return {
    loading,
    error,
    optionSets,
    refetch: wrappedRefetch,
  }
}
