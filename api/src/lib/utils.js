import { isPlainObject, startCase } from 'lodash'

import { ForbiddenError, ValidationError } from '@redwoodjs/graphql-server'

import { ROLE_LEVELS } from 'src/config'
import dayjs from 'src/lib/dayjs'
import { db } from 'src/lib/db'
import { getSetting } from 'src/lib/settingsCache'
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
  // console.log(
  //   `Preparing JSONB update for model ${modelName} with data:`,
  //   updateData
  // )
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
  for (const field of jsonFields) {
    if (field in updateData) {
      const base = currentData?.[field]
      const patch = updateData[field]

      if (!isPlainObject(patch)) {
        throw new ValidationError(`${modelName}.${field} must be an object`)
      }

      // Shallow merge top-level keys; keep unspecified keys from base.
      const baseObj =
        base && typeof base === 'object' && !Array.isArray(base) ? base : {}

      const out = { ...baseObj }
      for (const [k, v] of Object.entries(patch)) {
        if (v === undefined) {
          // treat undefined as "leave key unchanged"
          continue
        }
        out[k] = v // allow null/[], etc. to overwrite
      }

      merged[field] = out
    }
  }
  return merged
}

export const checkAccess = (dateField, action_id, type) => (item) => {
  if (!item) {
    return
  }
  const uCaseType = startCase(type)
  const settings = getSetting('restriction_settings')
  const {
    action_ids = [],
    access_date_min,
    access_date_max,
    access_date_threshold,
  } = context.currentUser

  if (!item?.[dateField]) {
    throw new ForbiddenError(
      `Incomplete ${type} data for access check - missing ${dateField} field`
    )
  }

  const idString = `You don't have access to ${type} id "${item.id}"`
  if (
    settings.access_date_min &&
    access_date_min &&
    item[dateField] < access_date_min
  ) {
    throw new ForbiddenError(
      `${idString} - ${uCaseType} ${dateField} ${item[dateField]} is before your minimum access date ${access_date_min}`
    )
  }

  const willExpire = item[dateField] > dayjs(access_date_max).endOf('day')

  const hasExpired =
    item[dateField] <
    dayjs().subtract(access_date_threshold, 'day').startOf('day')

  if (settings.access_date_max && access_date_max && willExpire) {
    throw new ForbiddenError(
      `${idString} - ${uCaseType} ${dateField} ${item[dateField]} is after your maximum access date ${access_date_max}`
    )
  }
  if (settings.access_date_threshold && access_date_threshold && hasExpired) {
    throw new ForbiddenError(
      `${idString} - ${uCaseType} ${dateField} ${item[dateField]} is older than your access date threshold of ${access_date_threshold} days`
    )
  }

  if (action_ids.length === 0) return true

  if (!item?.[action_id] || !action_ids.includes(item[action_id])) {
    throw new ForbiddenError(idString)
  }
}

export const filterAccess = (dateField, action_id) => {
  return (baseWhere = {}) => {
    const settings = getSetting('restriction_settings')
    const {
      action_ids = [],
      access_date_min,
      access_date_max,
      access_date_threshold,
    } = context.currentUser
    const where = { ...baseWhere }
    const dateConstraints = []
    if (where[dateField]) {
      dateConstraints.push(where[dateField])
    }
    if (access_date_min && settings.access_date_min) {
      dateConstraints.push({ gte: access_date_min })
    }
    if (access_date_max && settings.access_date_max) {
      dateConstraints.push({ lte: access_date_max })
    }
    if (access_date_threshold && settings.access_date_threshold) {
      dateConstraints.push({
        gte: dayjs().subtract(access_date_threshold, 'day').startOf('day'),
      })
    }
    if (dateConstraints.length > 0) {
      where.AND = dateConstraints.map((c) => ({ [dateField]: c }))
    }
    if (action_ids.length > 0) {
      where[action_id] = { ...where[action_id], in: action_ids }
    }
    return where
  }
}

export const validateRoleLevel = (minRole, role) => {
  const roleLevel = ROLE_LEVELS.indexOf(role)
  const minAccessLevel = ROLE_LEVELS.indexOf(minRole)

  // console.log('checkUserRole', {
  //   currentUserRole,
  //   roleLevel,
  //   minRole,
  //   minAccessLevel,
  // })

  if (roleLevel <= 0) {
    throw new Error(`Unknown user role ${role}`)
  }

  if (minAccessLevel <= 0) {
    throw new Error(`Unknown role ${minRole}`)
  }

  return roleLevel >= minAccessLevel
}

export const checkUserRole = (minRole, user) => {
  const currentUserRole = user?.roles?.[0]

  return validateRoleLevel(minRole, currentUserRole)
}

export const slugify = (text) => {
  return (
    text
      .trim()
      .toLowerCase()
      // Convert to nearest compatible ascii chars
      // (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
      .normalize('NFKD')
      // Remove characters that aren’t alphanumerics, underscores, hyphens, or
      // whitespace
      .replace(/[^\w\s-]+/g, '')
      // Replace any whitespace or repeated dashes with single dashes
      .replace(/[-\s]+/g, '-')
      // Remove leading and trailing whitespace, dashes, and underscores
      .replace(/^[\s-_]+|[\s-_]+$/g, '')
  )
}
