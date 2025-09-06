import { ForbiddenError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'
import { checkAccess, filterAccess, prepareJsonUpdate } from 'src/lib/utils'

export const checkLogAccess = checkAccess('time', 'action_id', 'log')

export const checkLogsAccess = async (ids, tx) => {
  const logs = await (tx || db).$unfilteredQuery.log.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      action_id: true,
      time: true,
      custom_fields: true,
    },
  })

  if (logs.length !== ids.length) {
    throw new ForbiddenError('One or more logs not found')
  }

  logs.forEach((log) => {
    checkLogAccess(log)
  })
  return logs
}

export const filterLogAccess = filterAccess('time', 'action_id')
export const logs = (
  {
    params: { where = {}, orderBy = { time: 'desc' }, take = 20, skip = 0 },
  } = { params: {} }
) => {
  return db.log.findMany({
    where: filterLogAccess(where),
    orderBy,
    take,
    skip,
  })
}

export const log = async ({ id }) => {
  const log = await db.log.findUnique({
    where: { id },
  })
  checkLogAccess(log)
  return log
}

export const arresteeLogs = ({ arrestee_id }) => {
  const where = { arrests: { some: { id: arrestee_id } } }
  return db.log.findMany({
    where: filterLogAccess(where),
  })
}

const prepareData = ({ log, arrests = [], action_id, id }) => {
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
  await checkLogsAccess([id])
  const current = await db.log.findUnique({ where: { id } })

  const data = prepareData({
    log: input,
    arrests,
    action_id,
    id,
  })
  const mergedInput = await prepareJsonUpdate('Log', data, { current })

  return db.log.update({
    data: mergedInput,
    where: { id },
  })
}

export const deleteLog = async ({ id }) => {
  await checkLogsAccess([id])
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
