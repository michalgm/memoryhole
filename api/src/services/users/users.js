import dayjs from 'dayjs'

import {
  validate,
  validateUniqueness,
  validateWith,
  validateWithSync,
} from '@redwoodjs/api'

import { requireAuth } from 'src/lib/auth'
import { initUser, onboardUser } from 'src/lib/authHelpers'
import { db } from 'src/lib/db'

export const ROLE_LEVELS = [null, 'Operator', 'Coordinator', 'Admin']

export function getRoleLevel(role) {
  return ROLE_LEVELS.indexOf(role) || 0
}

const getUserRole = (user) => {
  return user?.roles?.[0] || user.role
}

export function canManageRole(currentUser, targetRole) {
  const currentUserRole = getUserRole(currentUser)
  const userLevel = getRoleLevel(currentUserRole)
  const targetLevel = getRoleLevel(targetRole)
  return userLevel >= targetLevel && userLevel >= 0 && targetLevel >= 0
}

const requireAdmin = () => requireAuth({ roles: ['Admin', 'Coordinator'] })

export const users = () => {
  return db.user.findMany()
}

export const user = ({ id }) => {
  return db.user.findUnique({
    where: { id },
  })
}

export const searchUsers = ({ search = '' }) => {
  const where = {
    OR: search.split(/\s+/).map((term) => ({
      OR: [
        {
          name: {
            contains: term,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: term,
            mode: 'insensitive',
          },
        },
      ],
    })),
  }
  return db.user.findMany({
    where,
    take: 10,
    orderBy: {
      name: 'asc',
    },
  })
}

export const createUser = async ({ input }) => {
  requireAdmin()

  const { data, token } = initUser(input)
  await validateUserUpdate({ id: null, input })
  return await validateUniqueness(
    'user',
    { email: input.email },
    { db },
    async (db) => {
      const user = await db.user.create({
        data,
      })

      await onboardUser(user, token)

      return user
    }
  )
}

const validateUserUpdate = async ({ id, input }) => {
  const currentUser = context.currentUser

  if (input.email || input.role) {
    requireAdmin()
  }
  if (input.email) {
    validate(input.email, {
      presence: {
        message: 'Email is required',
      },
      email: {
        message: 'Email is invalid',
      },
    })
  }
  if (context.currentUser.id === id) {
    ;['expiresAt', 'arrest_date_min', 'arrest_date_max'].forEach((key) => {
      validate(input[key], {
        absence: {
          message: `You cannot change your own ${key} value`,
        },
      })
    })
  }
  if (input.arrest_date_max) {
    input.arrest_date_max = dayjs(input.arrest_date_max).endOf('day')
  }

  // Check if current user can manage the target role
  validateWithSync(() => {
    if (input.role && !canManageRole(currentUser, input.role)) {
      throw 'You cannot assign a role higher than your own'
    }
  })

  if (id) {
    await validateWith(async () => {
      // Get target user's current role
      const targetUser = await db.user.findUnique({ where: { id } })
      const targetRole = getUserRole(targetUser)
      if (!canManageRole(currentUser, targetRole)) {
        throw 'You cannot modify users with a role higher than your own'
      }
    })
  }
}

export const updateUser = async ({ id, input }) => {
  await validateUserUpdate({ id, input })

  const doUserUpdate = async (db) => {
    return db.user.update({
      data: input,
      where: { id },
    })
  }
  if (input.email) {
    return validateUniqueness(
      'user',
      { email: input.email, $self: { id } },
      { db },
      doUserUpdate
    )
  }
  return doUserUpdate(db)
}

export const bulkUpdateUsers = async ({ ids, input }) => {
  validateWithSync(() => {
    if (input.email) {
      throw new Error('Cannot bulk update user emails')
    }
  })
  const users = await db.user.findMany({
    where: {
      id: { in: ids },
    },
  })
  // Run all validations concurrently
  await Promise.all(users.map(({ id }) => validateUserUpdate({ id, input })))

  const res = await db.$transaction(
    users.map(({ id }) => {
      return db.user.update({
        data: input,
        where: { id },
      })
    })
  )
  return { count: res.length }
}

export const deleteUser = async ({ id }) => {
  const currentUser = context.currentUser
  requireAdmin()

  const targetUser = await db.user.findUnique({ where: { id } })
  validateWithSync(() => {
    if (!canManageRole(currentUser, targetUser.role)) {
      throw new Error(
        'You cannot delete users with a role higher than your own'
      )
    }
  })

  return db.user.delete({
    where: { id },
  })
}

export const User = {
  actions: (_obj, { root }) => {
    return db.action.findMany({
      where: {
        id: {
          in: root.action_ids || [],
        },
      },
    })
  },
}
