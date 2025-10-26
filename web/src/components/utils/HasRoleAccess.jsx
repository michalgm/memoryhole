import { ROLE_LEVELS } from 'src/../../api/src/config'
import { useAuth } from 'src/auth'

export const validateRoleLevel = (requiredRole, currentUser) => {
  const userRole = currentUser?.roles?.[0]
  const userRoleLevel = ROLE_LEVELS.indexOf(userRole)
  const requiredRoleLevel = ROLE_LEVELS.indexOf(requiredRole)
  if (requiredRole && requiredRoleLevel < 0) {
    console.warn(`Unknown required role: ${requiredRole}`)
    return false
  }
  if (userRoleLevel < requiredRoleLevel) {
    return false
  }

  return true
}

const HasRoleAccess = ({ children, requiredRole }) => {
  const { currentUser } = useAuth()

  if (validateRoleLevel(requiredRole, currentUser)) {
    return children
  }
}
export default HasRoleAccess
