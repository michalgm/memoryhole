import { ForbiddenError } from '@cedarjs/graphql-server'

import { db } from 'src/lib/db'
import { checkAccess, filterAccess, prepareJsonUpdate } from 'src/lib/utils'
import {
  checkArrestsAccess,
  filterArrestAccess,
} from 'src/services/arrests/arrests'

export const checkLogAccess = checkAccess('time', 'action_id', 'log')

export const checkLogsAccess = async (ids, tx) => {
  const logs = await (tx || db).log.findMany({
    where: { id: { in: ids } },
    select: { id: true, action_id: true, time: true, custom_fields: true },
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
  return db.log.findMany({ where: filterLogAccess(where), orderBy, take, skip })
}

export const log = async ({ id }) => {
  const log = await db.log.findUnique({ where: { id } })
  checkLogAccess(log)
  return log
}

export const arresteeLogs = ({ arrestee_id }) => {
  const where = { arrests: { some: { id: arrestee_id } } }
  return db.log.findMany({ where: filterLogAccess(where) })
}

const prepareData = ({ log, arrests, action_id, id }) => {
  const data = {
    ...log,
    updated_by: { connect: { id: context.currentUser.id } },
  }
  if (arrests !== undefined) {
    data.arrests = {
      [id ? 'set' : 'connect']: (arrests || []).map((id) => ({ id })),
    }
  }
  if (action_id !== undefined) {
    data.action =
      action_id === null ? { disconnect: true } : { connect: { id: action_id } }
  }
  if (!id) {
    data.created_by = { connect: { id: context.currentUser.id } }
  }
  return data
}

export const createLog = ({ input: { arrests = [], action_id, ...input } }) => {
  const data = prepareData({ log: input, arrests, action_id })
  return db.log.create({ data })
}

const checkUserCanUpdateLogArrests = async (logId, current) => {
  const filtered = await db.log.findUnique({
    where: { id: logId },
    include: {
      arrests: { select: { id: true }, where: filterArrestAccess({}) },
    },
  })

  if (filtered.arrests.length !== current.arrests.length) {
    const hiddenCount = current.arrests.length - filtered.arrests.length
    throw new ForbiddenError(
      `Cannot update arrests for this log because it contains ${hiddenCount} arrests you do not have access to.`
    )
  }
}
export const updateLog = async ({
  id,
  input: { arrests, action_id, ...input },
}) => {
  await checkLogsAccess([id])
  await checkArrestsAccess(arrests || [])

  const current = await db.log.findUnique({
    where: { id },
    include: { arrests: { select: { id: true } } },
  })

  if (arrests !== undefined) {
    await checkUserCanUpdateLogArrests(id, current)
  }

  const data = prepareData({ log: input, arrests, action_id, id })

  const mergedInput = await prepareJsonUpdate('Log', data, { current })
  return db.log.update({ data: mergedInput, where: { id } })
}

export const deleteLog = async ({ id }) => {
  await checkLogsAccess([id])
  return db.log.delete({ where: { id } })
}

export const Log = {
  created_by: (_obj, { root }) => {
    return db.log.findUnique({ where: { id: root?.id } }).created_by()
  },
  updated_by: (_obj, { root }) => {
    return db.log.findUnique({ where: { id: root?.id } }).updated_by()
  },
  arrests: async (_obj, { root }) => {
    return db.log
      .findUnique({ where: { id: root?.id } })
      .arrests({ where: filterArrestAccess({}) })
  },
  action: (_obj, { root }) => {
    return db.log.findUnique({ where: { id: root?.id } }).action()
  },
}
