import { db } from 'src/lib/db'
import { checkAccess, filterAccess } from 'src/lib/utils'

import { filterArrestAccess } from '../arrests/arrests'

export const checkActionAccess = checkAccess('start_date', 'id', 'action')

export const filterActionAccess = filterAccess('start_date', 'id')

export const actions = () => {
  return db.action.findMany({ where: filterActionAccess({}) })
}

export const action = async ({ id }) => {
  const action = await db.action.findUnique({
    where: { id },
  })
  await checkActionAccess(action)
  return action
}

export const searchActions = ({ search = '' }) => {
  const where = {
    OR: search.split(/\s+/).map((term) => ({
      name: {
        contains: term,
        mode: 'insensitive',
      },
    })),
  }
  return db.action.findMany({
    where: filterActionAccess(where),
    take: 10,
    orderBy: [
      {
        start_date: 'desc',
      },
      {
        name: 'asc',
      },
    ],
  })
}

export const createAction = ({ input }) => {
  return db.action.create({
    data: input,
  })
}

export const updateAction = async ({ id, input }) => {
  await checkActionAccess(await action({ id }))
  return db.action.update({
    data: input,
    where: { id },
  })
}

export const deleteAction = async ({ id, deleteRelations = false }) => {
  await checkActionAccess(await action({ id }))

  if (deleteRelations) {
    // First delete all associated arrests and logs in a transaction
    await db.$transaction([
      db.arrest.deleteMany({ where: { action_id: id } }),
      db.log.deleteMany({ where: { action_id: id } }),
      db.action.delete({ where: { id } }),
    ])
    return { id }
  }

  return db.action.delete({
    where: { id },
  })
}

export const Action = {
  Arrest: (_obj, { root }) => {
    return db.action
      .findUnique({ where: { id: root?.id } })
      .Arrest({ where: filterArrestAccess({}) })
  },
  arrests_count: async (_obj, { root }) => {
    const result = await db.action.findUnique({
      where: { id: root?.id },
      select: { _count: { select: { Arrest: true } } },
    })
    return result._count.Arrest
  },
  logs_count: async (_obj, { root }) => {
    const result = await db.action.findUnique({
      where: { id: root?.id },
      select: { _count: { select: { Log: true } } },
    })
    return result._count.Log
  },
  // arrest_custody_status: async (_obj, { root }) => {
  //   const arrests = await db.arrest.findMany({
  //     where: { action_id: root?.id },
  //     select: { custom_fields: true },
  //   })

  //   return arrests.reduce((acc, arrest) => {
  //     const status = arrest.custom_fields.custody_status
  //     acc[status] = (acc[status] || 0) + 1
  //     return acc
  //   }, {})
  // },
}
