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

export const updateUser = async ({ id, input }) => {
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
  return await validateUniqueness(
    'user',
    { email: input.email, $self: { id } },
    (db) => {
      return db.user.update({
        data: input,
        where: { id },
      })
    }
  )
}

export const bulkUpdateUsers = async ({ ids, input }) => {
  const users = await db.user.findMany({
    where: {
      id: { in: ids },
    },
  })
  const res = await db.$transaction(
    users.map(({ id, ..._user }) => {
      // ;[
      //   'id',
      //   'arrestee_id',
      //   'created_by_id',
      //   'updated_by_id',
      //   'updated_at',
      //   'created_at',
      // ].forEach((key) => {
      //   delete arrest[key]
      //   delete arrest.arrestee[key]
      // })
      // const arrest_input = merge(arrest, input)

      return updateUser({
        id,
        input,
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
  created_arrests: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).created_arrests()
  },
  updated_arrests: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).updated_arrests()
  },
  created_arrestees: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).created_arrestees()
  },
  updated_arrestees: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).updated_arrestees()
  },
  created_arrestee_logs: (_obj, { root }) => {
    return db.user
      .findUnique({ where: { id: root?.id } })
      .created_arrestee_logs()
  },
  updated_arrestee_logs: (_obj, { root }) => {
    return db.user
      .findUnique({ where: { id: root?.id } })
      .updated_arrestee_logs()
  },
  created_hotline_logs: (_obj, { root }) => {
    return db.user
      .findUnique({ where: { id: root?.id } })
      .created_hotline_logs()
  },
  updated_hotline_logs: (_obj, { root }) => {
    return db.user
      .findUnique({ where: { id: root?.id } })
      .updated_hotline_logs()
  },
  updated_custom_schemas: (_obj, { root }) => {
    return db.user
      .findUnique({ where: { id: root?.id } })
      .updated_custom_schemas()
  },
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
