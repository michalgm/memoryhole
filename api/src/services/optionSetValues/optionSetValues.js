import { db } from 'src/lib/db'

export const optionSetValues = () => {
  return db.optionSetValue.findMany()
}

export const optionSetValue = ({ id }) => {
  return db.optionSetValue.findUnique({
    where: { id },
  })
}

export const createOptionSetValue = ({ input }) => {
  return db.optionSetValue.create({
    data: input,
  })
}

export const updateOptionSetValue = ({ id, input }) => {
  return db.optionSetValue.update({
    data: input,
    where: { id },
  })
}

export const deleteOptionSetValue = ({ id }) => {
  return db.optionSetValue.delete({
    where: { id },
  })
}

export const OptionSetValue = {
  option_set_details: (_obj, { root }) => {
    return db.optionSetValue
      .findUnique({ where: { id: root?.id } })
      .option_set_details()
  },
}
