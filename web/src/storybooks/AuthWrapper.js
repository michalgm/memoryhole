import { useAuth } from 'src/auth'

const AuthWrapper = ({ children }) => {
  const auth = useAuth()
  if (!auth.isAuthenticated) {
    const username = process.env.REDWOOD_ENV_AUTH_USER
    const password = process.env.REDWOOD_ENV_AUTH_PASSWORD
    auth
      .logIn({
        username,
        password,
      })
      .then((res) => console.warn(auth))
  }

  return children
}
export default AuthWrapper
