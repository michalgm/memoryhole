import { db } from 'src/lib/db'

export const hotlineLogs = () => {
  return db.hotlineLog.findMany()
}

export const hotlineLog = ({ id }) => {
  return db.hotlineLog.findUnique({
    where: { id },
  })
}

export const createHotlineLog = ({ input }) => {
  return db.hotlineLog.create({
    data: input,
  })
}

export const updateHotlineLog = ({ id, input }) => {
  return db.hotlineLog.update({
    data: input,
    where: { id },
  })
}

export const deleteHotlineLog = ({ id }) => {
  return db.hotlineLog.delete({
    where: { id },
  })
}

export const HotlineLog = {
  createdBy: (_obj, { root }) => {
    return db.hotlineLog.findUnique({ where: { id: root?.id } }).createdBy()
  },
  updatedBy: (_obj, { root }) => {
    return db.hotlineLog.findUnique({ where: { id: root?.id } }).updatedBy()
  },
}
