import { merge } from 'lodash'

import { db } from 'src/lib/db'
import { jsonbFields } from 'src/lib/utils/jsonbFieldsFromSDL'

/**
 * Prepares update data for models with JSONB fields by merging existing and new data.
 * @param {string} modelName - The Prisma model/service name (e.g., 'User', 'Arrestee').
 * @param {object} updateData - The update data object (fields to update).
 * @param {object} options - { id, tx, current } - id is required if current is not provided; tx is optional Prisma transaction; current is the current DB row if already fetched.
 * @returns {Promise<object>} - The merged update data.
 */
export async function prepareJsonUpdate(
  modelName,
  updateData,
  { id, tx, current } = {}
) {
  console.log(
    `Preparing JSONB update for model ${modelName} with data:`,
    updateData
  )
  const jsonFields = jsonbFields[modelName] || []
  let currentData = current
  if (!currentData) {
    if (!id) {
      throw new Error(
        'ID is required to fetch current record for merging JSONB fields'
      )
    }
    const prisma = tx || db
    currentData = await prisma[modelName.toLowerCase()].findUnique({
      where: { id },
    })
    if (!currentData) throw new Error(`${modelName} with id ${id} not found`)
  }
  const merged = { ...updateData }
  console.log('JSON FIELDS', jsonbFields)
  for (const field of jsonFields) {
    if (field in updateData) {
      console.log(
        `Merging JSONB field ${field} for model ${modelName}`,
        currentData[field],
        updateData[field]
      )
      merged[field] = merge({}, currentData[field], updateData[field])
    }
  }
  return merged
}
