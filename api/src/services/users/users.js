import dayjs from 'dayjs'

import { validate, validateUniqueness } from '@redwoodjs/api'

import { requireAuth } from 'src/lib/auth'
import { initUser, onboardUser } from 'src/lib/authHelpers'
import { db } from 'src/lib/db'

const requireAdmin = () => requireAuth({ roles: 'Admin' })
export const users = () => {
  return db.user.findMany()
}

export const user = ({ id }) => {
  return db.user.findUnique({
    where: { id },
  })
}

export const createUser = async ({ input }) => {
  requireAdmin()

  const { data, token } = initUser(input)

  return await validateUniqueness(
    'user',
    { email: input.email },
    async (db) => {
      const user = await db.user.create({
        data,
      })

      await onboardUser(user, token)

      return user
    }
  )
}

const validateUserUpdate = ({ id, input }) => {
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
}

export const updateUser = ({ id, input }) => {
  validateUserUpdate({ id, input })

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
      doUserUpdate
    )
  }
  return doUserUpdate(db)
}

export const bulkUpdateUsers = async ({ ids, input }) => {
  if (input.email) {
    throw new Error('Cannot bulk update user emails')
  }
  const users = await db.user.findMany({
    where: {
      id: { in: ids },
    },
  })
  const res = await db.$transaction(
    users.map(({ id }) => {
      validateUserUpdate({ id, input })

      return db.user.update({
        data: input,
        where: { id },
      })
    })
  )
  return { count: res.length }
}

export const deleteUser = ({ id }) => {
  requireAdmin()
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
