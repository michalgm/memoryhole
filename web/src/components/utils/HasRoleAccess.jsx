import { ROLE_LEVELS } from 'src/../../api/src/config'
import { useAuth } from 'src/auth'

const HasRoleAccess = ({ children, requiredRole }) => {
  const { currentUser } = useAuth()
  const userRoleLevel = ROLE_LEVELS.indexOf(currentUser?.roles?.[0])
  const requiredRoleLevel = ROLE_LEVELS.indexOf(requiredRole)

  if (requiredRole && requiredRoleLevel < 0) {
    console.warn(`Unknown required role: ${requiredRole}`)
    return null
  }
  if (userRoleLevel < requiredRoleLevel) {
    return null
  }

  return children
}
export default HasRoleAccess
