import { db } from 'src/lib/db'

export const arrestees = () => {
  return db.arrestee.findMany()
}

export const arrestee = ({ id }) => {
  return db.arrestee.findUnique({
    where: { id },
  })
}

export const createArrestee = ({ input }) => {
  return db.arrestee.create({
    data: input,
  })
}

export const updateArrestee = ({ id, input }) => {
  return db.arrestee.update({
    data: input,
    where: { id },
  })
}

export const deleteArrestee = ({ id }) => {
  return db.arrestee.delete({
    where: { id },
  })
}

export const Arrestee = {
  createdBy: (_obj, { root }) => {
    return db.arrestee.findUnique({ where: { id: root?.id } }).createdBy()
  },
  updatedBy: (_obj, { root }) => {
    return db.arrestee.findUnique({ where: { id: root?.id } }).updatedBy()
  },
  arrests: (_obj, { root }) => {
    return db.arrestee.findUnique({ where: { id: root?.id } }).arrests()
  },
  arrestee_logs: (_obj, { root }) => {
    return db.arrestee.findUnique({ where: { id: root?.id } }).arrestee_logs()
  },
}
