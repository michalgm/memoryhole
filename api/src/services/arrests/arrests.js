import { arrestee } from '../arrestees/arrestees'
import { db } from 'src/lib/db'

export const arrests = () => {
  return db.arrest.findMany()
}

export const arrest = ({ id }) => {
  return db.arrest.findUnique({
    where: { id },
  })
}

export const createArrest = ({ input: {arrestee, arrest} }) => {
  return db.arrest.create({
    data: {
      ...arrest,
      arrestee: {
        create: arrestee
      }
    },
  })
}

export const updateArrest = ({ id, input: {arrestee: {id:arrestee_id, ...arrestee}, ...input} }) => {
  return db.arrest.update({
    data: {
      ...input,
      arrestee: {
        update: {
          data: arrestee,
          where: {id: arrestee_id}
        }
      },
    },
    where: { id },
  })
}

export const deleteArrest = ({ id }) => {
  return db.arrest.delete({
    where: { id },
  })
}

export const Arrest = {
  arrestee: (_obj, { root }) => {
    return db.arrest.findUnique({ where: { id: root?.id } }).arrestee()
  },
  createdBy: (_obj, { root }) => {
    return db.arrest.findUnique({ where: { id: root?.id } }).createdBy()
  },
  updatedBy: (_obj, { root }) => {
    return db.arrest.findUnique({ where: { id: root?.id } }).updatedBy()
  },
}
