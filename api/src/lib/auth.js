import { AuthenticationError, ForbiddenError } from '@cedarjs/graphql-server'

import { validateUserExpiration } from 'src/functions/auth'
import { checkUserRole } from 'src/lib/utils'

import { db } from './db'
/**
 * The name of the cookie that dbAuth sets
 *
 * %port% will be replaced with the port the api server is running on.
 * If you have multiple RW apps running on the same host, you'll need to
 * make sure they all use unique cookie names
 */
export const cookieName = 'session_%port%'

/**
 * The session object sent in as the first argument to getCurrentUser() will
 * have a single key `id` containing the unique ID of the logged in user
 * (whatever field you set as `authFields.id` in your auth function config).
 * You'll need to update the call to `db` below if you use a different model
 * name or unique field name, for example:
 *
 *   return await db.profile.findUnique({ where: { email: session.id } })
 *                   ───┬───                       ──┬──
 *      model accessor ─┘      unique id field name ─┘
 *
 * !! BEWARE !! Anything returned from this function will be available to the
 * client--it becomes the content of `currentUser` on the web side (as well as
 * `context.currentUser` on the api side). You should carefully add additional
 * fields to the `select` object below once you've decided they are safe to be
 * seen if someone were to open the Web Inspector in their browser.
 */
export const getCurrentUser = async (session) => {
  if (!session || typeof session.id !== 'number') {
    throw new Error('Invalid session')
  }

  const { role, ...user } = await db.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      action_ids: true,
      access_date_max: true,
      access_date_min: true,
      access_date_threshold: true,
      expiresAt: true,
    },
  })
  const roles = validateUserExpiration(user) ? [role] : ['Restricted']

  return { ...user, roles }
}

/**
 * The user is authenticated if there is a currentUser in the context
 *
 * @returns {boolean} - If the currentUser is authenticated
 */
export const isAuthenticated = () => {
  return !!context.currentUser
}

/**
 * When checking role membership, roles can be a single value, a list, or none.
 * You can use Prisma enums too (if you're using them for roles), just import your enum type from `@prisma/client`
 */

/**
 * Checks if the currentUser is authenticated (and assigned one of the given roles)
 *
 * @param roles: {@link AllowedRoles} - Checks if the currentUser is assigned one of these roles
 *
 * @returns {boolean} - Returns true if the currentUser is logged in and assigned one of the given roles,
 * or when no roles are provided to check against. Otherwise returns false.
 */
export const hasRoleLevel = (minRole) => {
  if (!isAuthenticated()) {
    return false
  }
  return checkUserRole(minRole, context.currentUser)
}

/**
 * Use requireAuth in your services to check that a user is logged in,
 * whether or not they are assigned a role, and optionally raise an
 * error if they're not.
 *
 * @param roles: {@link AllowedRoles} - When checking role membership, these roles grant access.
 *
 * @returns - If the currentUser is authenticated (and assigned one of the given roles)
 *
 * @throws {@link AuthenticationError} - If the currentUser is not authenticated
 * @throws {@link ForbiddenError} If the currentUser is not allowed due to role permissions
 *
 * @see https://github.com/redwoodjs/redwood/tree/main/packages/auth for examples
 */
export const requireAuth = ({ minRole = 'Operator' } = {}) => {
  if (!isAuthenticated()) {
    throw new AuthenticationError("You don't have permission to do that.")
  }
  if (minRole && !hasRoleLevel(minRole)) {
    throw new ForbiddenError("You don't have access to do that.")
  }
}
