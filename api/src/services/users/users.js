import { db } from 'src/lib/db'

export const users = () => {
  return db.user.findMany()
}

export const user = ({ id }) => {
  return db.user.findUnique({
    where: { id },
  })
}

export const createUser = ({ input }) => {
  return db.user.create({
    data: input,
  })
}

export const updateUser = ({ id, input }) => {
  return db.user.update({
    data: input,
    where: { id },
  })
}

export const deleteUser = ({ id }) => {
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
}