import { onError } from '@apollo/client/link/error'

import { navigate } from '@redwoodjs/router'

import { globalDisplayError } from 'src/components/utils/SnackBar'
const INVALID_AUTH_HEADER_ERROR =
  'Exception in getAuthenticationContext: The `Authorization` header is not valid.'

const checkAuthExpired = ({ graphQLErrors, networkError }) => {
  if (
    graphQLErrors[0]?.extensions?.originalError?.message ===
      INVALID_AUTH_HEADER_ERROR ||
    networkError?.result?.errors?.[0]?.extensions?.originalError?.message ===
      INVALID_AUTH_HEADER_ERROR
  ) {
    const currentLocation =
      location.pathname + encodeURIComponent(location.search)
    const params = new URLSearchParams(location.search)

    if (currentLocation.startsWith('/login') || params.get('redirectTo')) {
      return
    }
    globalDisplayError('Your session has expired. Please log in again.')
    navigate(`/login?redirectTo=${currentLocation}`)
    return true
  }
}

const errorLink = onError((error) => {
  if (checkAuthExpired(error)) {
    return
  }
  console.error(error)
  globalDisplayError(error)
})

export default errorLink
