import { UserInputError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'
import * as Definitions from 'src/lib/fieldDefinitions'

// Helper to determine model and field from definition key
const parseFieldKey = (context, key) => {
  const parts = key.split('.')
  let model
  let fieldPath

  if (context === 'arrest') {
    if (parts[0] === 'arrestee') {
      model = 'arrestee'
      fieldPath = parts.slice(1)
    } else {
      model = 'arrest'
      fieldPath = parts
    }
  } else {
    model = context
    fieldPath = parts
  }

  // Handle custom_fields
  // e.g. ['custom_fields', 'bipoc'] -> { col: 'custom_fields', path: ['bipoc'] }
  // e.g. ['state'] -> { col: 'state', path: [] }
  const col = fieldPath[0]
  const path = fieldPath.slice(1)

  return { model, col, path }
}

const getOptionSetUsages = (optionSetName) => {
  const usages = []

  for (const [name, defs] of Object.entries(Definitions.fieldDefinitions)) {
    for (const [key, props] of Object.entries(defs)) {
      if (props.optionSet === optionSetName) {
        const parsed = parseFieldKey(name, key)
        if (parsed) {
          usages.push({
            ...parsed,
            default: props.default,
            label: props.label || key,
            key,
          })
        }
      }
    }
  }
  return usages
}

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

    // VALIDATION: Check for usage of modified/deleted values
    const optionSetRecord = await db.optionSet.findUnique({ where: { id } })
    const usages = getOptionSetUsages(optionSetRecord.name)

    for (const value of values) {
      const original = existingValues.find((v) => v.id === value.id)

      // We only care if:
      // 1. It is being deleted explicitly
      // 2. It is being renamed (value changed from original)
      const isDeleting = value.deleted
      const isRenaming = original && original.value !== value.value

      if ((isDeleting || isRenaming) && original) {
        const valueToCheck = original.value

        // 1. Check Defaults
        for (const usage of usages) {
          if (usage.default === valueToCheck) {
            throw new UserInputError(
              `Cannot delete or rename option "${valueToCheck}" because it is the default value for field "${usage.key}"`
            )
          }
        }

        // 2. Check Database Usage
        for (const usage of usages) {
          if (!db[usage.model]) {
            console.warn(
              `Model "${usage.model}" not found in Prisma Client. Skipping validation for "${usage.key}".`
            )
            continue
          }

          let count = 0
          if (usage.path.length > 0 && usage.col === 'custom_fields') {
            // JSON Query
            // Prisma syntax for JSON filtering:
            // where: { custom_fields: { path: ['key'], equals: 'value' } }
            // Note: usage.path is array ['key']
            const where = {
              [usage.col]: {
                path: usage.path,
                equals: valueToCheck,
              },
            }
            count = await db[usage.model].count({ where })
          } else {
            // Standard Column Query
            const where = { [usage.col]: valueToCheck }
            count = await db[usage.model].count({ where })
          }

          if (count > 0) {
            throw new UserInputError(
              `Cannot delete or rename option "${valueToCheck}" because it is currently used by ${count} ${usage.model}(s) in field "${usage.key}"`
            )
          }
        }
      }
    }

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
