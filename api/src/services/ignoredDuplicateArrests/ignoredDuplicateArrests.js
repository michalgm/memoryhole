import { db } from 'src/lib/db'

export const ignoredDuplicateArrests = () => {
  return db.ignoredDuplicateArrest.findMany()
}

export const ignoredDuplicateArrest = ({ id }) => {
  return db.ignoredDuplicateArrest.findUnique({
    where: { id },
  })
}

export const createIgnoredDuplicateArrest = ({ arrest1_id, arrest2_id }) => {
  const [id_1, id_2] = arrest1_id < arrest2_id
    ? [arrest1_id, arrest2_id]
    : [arrest2_id, arrest1_id]

  return db.ignoredDuplicateArrest.create({
    data: {
      arrest1: { connect: { id: id_1 } },
      arrest2: { connect: { id: id_2 } },
      created_by: { connect: { id: context.currentUser.id } },
    },
  })
}

export const unIgnoreDuplicateArrest = ({ arrest1_id, arrest2_id }) => {
  return db.ignoredDuplicateArrest.deleteMany({
    where: {
      OR: [
        { arrest1_id, arrest2_id },
        { arrest1_id: arrest2_id, arrest2_id: arrest1_id },
      ],
    },
  })[0]
}

export const updateIgnoredDuplicateArrest = ({ id, input }) => {
  return db.ignoredDuplicateArrest.update({
    data: input,
    where: { id },
  })
}

export const deleteIgnoredDuplicateArrest = ({ id }) => {
  return db.ignoredDuplicateArrest.delete({
    where: { id },
  })
}

export const IgnoredDuplicateArrest = {
  arrest1: (_obj, { root }) => {
    return db.ignoredDuplicateArrest
      .findUnique({ where: { id: root?.id } })
      .arrest1()
  },
  arrest2: (_obj, { root }) => {
    return db.ignoredDuplicateArrest
      .findUnique({ where: { id: root?.id } })
      .arrest2()
  },
  createdBy: (_obj, { root }) => {
    return db.ignoredDuplicateArrest
      .findUnique({ where: { id: root?.id } })
      .createdBy()
  },
}
