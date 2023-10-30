import { db } from 'src/lib/db'

export const customSchemata = () => {
  return db.customSchema.findMany()
}

export const customSchema = ({ id }) => {
  return db.customSchema.findUnique({
    where: { id },
  })
}

export const createCustomSchema = ({ input }) => {
  return db.customSchema.create({
    data: input,
  })
}

export const updateCustomSchema = ({ id, input }) => {
  return db.customSchema.update({
    data: input,
    where: { id },
  })
}

export const deleteCustomSchema = ({ id }) => {
  return db.customSchema.delete({
    where: { id },
  })
}

export const CustomSchema = {
  updatedBy: (_obj, { root }) => {
    return db.customSchema.findUnique({ where: { id: root?.id } }).updatedBy()
  },
}
