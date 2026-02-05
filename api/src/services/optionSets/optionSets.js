import { db } from 'src/lib/db'

export const optionSets = () => {
  return db.optionSet.findMany({
    orderBy: {
      name: 'asc',
    },
    include: {
      values: {
        orderBy: { order: 'asc' },
      },
    },
  })
}

export const optionSet = ({ id }) => {
  return db.optionSet.findUnique({
    where: { id },
    include: {
      values: {
        orderBy: { order: 'asc' },
      },
    },
  })
}

// export const createOptionSet = ({ input: { values = [], ...input } }) => {
//   return db.$transaction(async (db) => {
//     const optionSet = await db.optionSet.create({
//       data: input,
//     })
//     await db.optionSetValue.createMany({
//       data: values.map((item) => ({ ...item, option_set_id: optionSet.id })),
//       skipDuplicates: true,
//     })
//     return optionSet
//   })
// }

export const updateOptionSetValues = async ({ id, input: { values = [] } }) => {
  return db.$transaction(async (db) => {
    // Get existing values
    const existingValues = await db.optionSetValue.findMany({
      where: { option_set_id: id },
    })

    const existingIds = existingValues.map((v) => v.id)

    // Delete values explicitly marked for deletion
    const idsToDelete = values.filter((v) => v.deleted && v.id).map((v) => v.id)
    if (idsToDelete.length > 0) {
      await db.optionSetValue.deleteMany({
        where: {
          id: { in: idsToDelete },
        },
      })
    }

    // Update or create values (skip deleted ones)
    for (const value of values) {
      if (value.deleted) continue
      const { id: valueId, deleted: _deleted, ...valueData } = value

      if (valueId && existingIds.includes(valueId)) {
        // Update existing value
        await db.optionSetValue.update({
          where: { id: valueId },
          data: { ...valueData, option_set_id: id },
        })
      } else if (!valueId) {
        // Create new value (only if no id)
        await db.optionSetValue.create({
          data: { ...valueData, option_set_id: id },
        })
      }
    }

    // Fetch and return the complete option set with values
    const updatedOptionSet = await db.optionSet.findUnique({
      where: { id },
      include: {
        values: {
          orderBy: { order: 'asc' },
        },
      },
    })

    return updatedOptionSet
  })
}

// export const deleteOptionSet = async ({ id }) => {
//   return db.$transaction(async (db) => {
//     await db.optionSetValue.deleteMany({ where: { option_set_id: id } })
//     return db.optionSet.delete({
//       where: { id },
//     })
//   })
// }
