import { merge } from 'lodash'

import { db } from 'src/lib/db'

export const logs = (
  {
    params: {
      where = {},
      orderBy = { created_at: 'desc' },
      take = 20,
      skip = 0,
    },
  } = { params: {} }
) => {
  return db.log.findMany({
    where,
    orderBy,
    take,
    skip,
  })
}

export const log = ({ id }) => {
  return db.log.findUnique({
    where: { id },
  })
}

export const arresteeLogs = ({ arrestee_id }) => {
  return db.log.findMany({
    where: {
      arrests: {
        some: { id: arrestee_id },
      },
    },
  })
}

const prepareData = ({ log, arrests = [], action_id, id }, current) => {
  const data = {
    ...log,
    updated_by: {
      connect: { id: context.currentUser.id },
    },
  }
  if (arrests.length) {
    data.arrests = {
      connect: arrests.map((id) => ({ id })),
    }
  }
  if (action_id) {
    data.action = { connect: { id: action_id } }
  }
  if (log.shift) {
    data.shift = merge(current.shift, log.shift)
  }
  if (!id) {
    data.created_by = {
      connect: { id: context.currentUser.id },
    }
  }
  return data
}

export const createLog = ({ input: { arrests = [], action_id, ...input } }) => {
  const data = prepareData({
    log: input,
    arrests,
    action_id,
  })
  return db.log.create({
    data,
  })
}

export const updateLog = async ({
  id,
  input: { arrests = [], action_id, ...input },
}) => {
  const current = await db.log.findUnique({ where: { id } })

  const data = prepareData(
    {
      log: input,
      arrests,
      action_id,
      id,
    },
    current
  )

  return db.log.update({
    data,
    where: { id },
  })
}

export const deleteLog = ({ id }) => {
  return db.log.delete({
    where: { id },
  })
}

export const Log = {
  created_by: (_obj, { root }) => {
    return db.log.findUnique({ where: { id: root?.id } }).created_by()
  },
  updated_by: (_obj, { root }) => {
    return db.log.findUnique({ where: { id: root?.id } }).updated_by()
  },
  arrests: (_obj, { root }) => {
    return db.log.findUnique({ where: { id: root?.id } }).arrests()
  },
  action: (_obj, { root }) => {
    return db.log.findUnique({ where: { id: root?.id } }).action()
  },
}
