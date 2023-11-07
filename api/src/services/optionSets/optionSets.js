import { db } from 'src/lib/db'

export const optionSets = () => {
  return db.optionSet.findMany({
    orderBy: {
      name: 'asc',
    },
    include: {
      values: {
        orderBy: {
          id: 'asc',
        },
      },
    },
  })
}

export const optionSet = ({ id }) => {
  return db.optionSet.findUnique({
    where: { id },
    include: {
      values: {
        orderBy: {
          id: 'asc',
        },
      },
    },
  })
}

export const createOptionSet = ({ input: { values, ...input } }) => {
  return db.$transaction(async (db) => {
    const optionSet = await db.optionSet.create({
      data: input,
    })
    await db.optionSetValue.createMany({
      data: values.map((item) => ({ ...item, option_set_id: optionSet.id })),
      skipDuplicates: true,
    })
    return optionSet
  })
}

export const updateOptionSet = ({ id, input: { values, ...input } }) => {
  return db.$transaction(async (db) => {
    const res = await db.optionSet.update({
      data: input,
      where: { id },
    })
    await db.optionSetValue.deleteMany({ where: { option_set_id: id } })
    await db.optionSetValue.createMany({
      data: values.map((item) => ({ ...item, option_set_id: id })),
      skipDuplicates: true,
    })
    return res
  })
}

export const deleteOptionSet = async ({ id }) => {
  return db.$transaction(async (db) => {
    await db.optionSetValue.deleteMany({ where: { option_set_id: id } })
    return db.optionSet.delete({
      where: { id },
    })
  })
}

export const OptionSet = {
  values: (_obj, { root }) => {
    return db.optionSet.findUnique({ where: { id: root?.id } }).values()
  },
}
