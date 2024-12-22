import { db } from 'src/lib/db'

export const actions = () => {
  return db.action.findMany()
}

export const action = ({ id }) => {
  return db.action.findUnique({
    where: { id },
  })
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
    where,
    take: 10,
    orderBy: {
      name: 'asc',
    },
  })
}

export const createAction = ({ input }) => {
  return db.action.create({
    data: input,
  })
}

export const updateAction = ({ id, input }) => {
  return db.action.update({
    data: input,
    where: { id },
  })
}

export const deleteAction = ({ id }) => {
  return db.action.delete({
    where: { id },
  })
}

export const Action = {
  Arrest: (_obj, { root }) => {
    return db.action.findUnique({ where: { id: root?.id } }).Arrest()
  },
}
