import { db } from 'src/lib/db'

export const logs = () => {
  return db.log.findMany()
}

export const arresteeLogs = ({ arrestee_id }) => {
  return db.log.findMany({
    where: { arrestee_id },
    orderBy: {
      created_at: 'desc',
    },
  })
}

export const log = ({ id }) => {
  return db.log.findUnique({
    where: { id },
  })
}

export const createLog = ({ input: { arrestee_id, ...input } }) => {
  return db.log.create({
    data: {
      ...input,
      arrestee: {
        connect: {
          id: arrestee_id,
        },
      },
      updated_by: {
        connect: { id: context.currentUser.id }, // Assuming 1 is the ID of the user you want to connect
      },
      created_by: {
        connect: { id: context.currentUser.id }, // Assuming 1 is the ID of the user you want to connect
      },
    },
  })
}

export const updateLog = ({ id, input }) => {
  return db.log.update({
    data: {
      ...input,
      updated_by: {
        connect: { id: context.currentUser.id }, // Assuming 1 is the ID of the user you want to connect
      },
    },
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
  created_by: (_obj, { root }) => {
    return db.log.findUnique({ where: { id: root?.id } }).created_by()
  },
  updated_by: (_obj, { root }) => {
    return db.log.findUnique({ where: { id: root?.id } }).updated_by()
  },
}
