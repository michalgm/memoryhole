import { db } from 'src/lib/db'

export const logs = () => {
  return db.log.findMany()
}

export const log = ({ id }) => {
  return db.log.findUnique({
    where: { id },
  })
}

export const createLog = ({ input }) => {
  return db.log.create({
    data: input,
  })
}

export const updateLog = ({ id, input }) => {
  return db.log.update({
    data: input,
    where: { id },
  })
}

export const deleteLog = ({ id }) => {
  return db.log.delete({
    where: { id },
  })
}

export const Log = {
  arrestee: (_obj, { root }) => {
    return db.log.findUnique({ where: { id: root?.id } }).arrestee()
  },
  createdBy: (_obj, { root }) => {
    return db.log.findUnique({ where: { id: root?.id } }).createdBy()
  },
  updatedBy: (_obj, { root }) => {
    return db.log.findUnique({ where: { id: root?.id } }).updatedBy()
  },
}
