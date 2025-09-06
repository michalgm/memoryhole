import { validate, validateWithSync } from '@redwoodjs/api'
import { ForbiddenError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'
import { checkAccess, filterAccess, prepareJsonUpdate } from 'src/lib/utils'

import dayjs from '../../lib/dayjs'
import { updateDisplayField as updateArresteeDisplayField } from '../arrestees/arrestees'

import * as duplicateArrests from './duplicateArrests'

export { duplicateArrests }

export const checkArrestAccess = checkAccess('date', 'action_id', 'arrest')
export const checkArrestsAccess = async (ids, tx) => {
  const arrests = await (tx || db).$unfilteredQuery.arrest.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      action_id: true,
      date: true,
      custom_fields: true,
      arrestee: {
        select: {
          id: true,
          custom_fields: true,
        },
      },
    },
  })

  if (arrests.length !== ids.length) {
    throw new ForbiddenError('One or more arrests not found')
  }

  arrests.forEach((arrest) => {
    checkArrestAccess(arrest)
  })
  return arrests
}
export const filterArrestAccess = filterAccess('date', 'action_id')

export const arrests = ({ where = {} } = {}) => {
  return db.arrest.findMany({
    where: filterArrestAccess(where),
  })
}

export const filterArrests = async ({ filters = [] }) => {
  // await new Promise((resolve) => setTimeout(resolve, 5000))
  const where = {}
  filters.forEach((filter) => {
    let { field, operator, value } = filter
    let query = {
      [operator]: value,
    }
    const parts = field.split('.')
    const dbField = parts[0]
    if (parts.length > 1) {
      if (parts[0] === 'custom_fields') {
        query = { path: [parts[1]], ...query }
      } else {
        query = {
          [parts[1]]: {
            ...query,
            mode: 'insensitive',
          },
        }
      }
    }
    where[dbField] = query
  })

  return db.arrest.findMany({
    where: filterArrestAccess(where),
    orderBy: {
      date: 'desc',
    },
  })
}

export const arrest = async ({ id }) => {
  const arrest = await db.arrest.findUnique({
    where: { id },
  })
  checkArrestAccess(arrest)
  return arrest
}

export const searchArrests = ({ search = '', action_id }) => {
  const where = {
    OR: search.split(/\s+/).map((term) => ({
      OR: [
        {
          arrestee: {
            first_name: {
              contains: term,
              mode: 'insensitive',
            },
          },
        },
        {
          arrestee: {
            last_name: {
              contains: term,
              mode: 'insensitive',
            },
          },
        },
        {
          arrestee: {
            email: {
              contains: term,
              mode: 'insensitive',
            },
          },
        },
        {
          arrestee: {
            preferred_name: {
              contains: term,
              mode: 'insensitive',
            },
          },
        },
      ],
    })),
  }
  if (action_id) {
    where.action_id = action_id
  }
  return db.arrest.findMany({
    where: filterArrestAccess(where),
    take: 10,
    orderBy: {
      date: 'desc',
    },
  })
}

export const docketSheetSearch = async ({
  date: dateRaw,
  days,
  report_type,
  jurisdiction,
  arrest_city,
  // include_contact,
}) => {
  const date = dayjs(dateRaw)
  const dateLimit = date.add(days, 'day').toDate()
  const where = {}
  if (jurisdiction) {
    where.jurisdiction = jurisdiction
  }
  if (arrest_city) {
    where.arrest_city = arrest_city
  }

  if (report_type === 'arrest_date') {
    where.date = {
      gte: date,
      lt: dateLimit,
    }
  } else {
    where.date = {
      lte: dateLimit,
    }
  }
  const records = await arrests({
    where,
  })
  return records.filter(({ custom_fields }) => {
    if (report_type === 'arrest_date') {
      return true
    }
    // FIXME - this is a temporary fix to filter by next court date - prisma doesn't support date filters on JSON fields. Need to blow up the whole nested-JSON design and move to something like an EAV approach
    if (custom_fields.next_court_date) {
      const court_date = dayjs(new Date(custom_fields.next_court_date))
      return court_date >= date && court_date < dayjs(dateLimit)
    }
  })
}

const updateDisplayField = (arrest) => {
  if (arrest.date) {
    arrest.display_field = dayjs(arrest.date).format('L')
  } else {
    delete arrest.date
  }
}

const validateAndPrepareData = (
  { id: _id, action_id, arrestee, ...arrest },
  current = {}
) => {
  const data = {
    ...arrest,
    updated_by: {
      connect: { id: context.currentUser.id },
    },
  }

  if (arrestee) {
    validateWithSync(() => {
      if (arrestee.email) {
        validate(arrestee.email, 'Email', { email: true })
      }
    })
    updateArresteeDisplayField(arrestee, current.arrestee)

    data.arrestee = {
      update: {
        data: arrestee,
      },
    }
  }
  if (arrest.custom_fields) {
    if (arrest.custom_fields.next_court_date) {
      validateWithSync(() => {
        validate(arrest.custom_fields.next_court_date, 'Next Court Date', {
          custom: {
            with: () => {
              if (
                arrest?.custom_fields?.next_court_date &&
                !dayjs(arrest.custom_fields.next_court_date).isValid()
              ) {
                throw new Error('Invalid date')
              }
            },
          },
        })
      })
    }
  }
  updateDisplayField(arrest)
  if (action_id) {
    data.action = { connect: { id: action_id } }
  }

  return data
}

export const createArrest = ({ input: { arrestee, action_id, ...arrest } }) => {
  checkArrestAccess({ ...arrest, action_id })
  const data = validateAndPrepareData({
    action_id,
    arrestee,
    ...arrest,
  })
  if (data.arrestee) {
    data.arrestee.create = data.arrestee.update.data
    delete data.arrestee.update
  }
  return db.arrest.create({
    data: {
      ...data,
      created_by: {
        connect: { id: context.currentUser.id },
      },
    },
  })
}

export const updateArrest = async ({
  id,
  input: { action_id, ...input },
  tx = db,
}) => {
  await checkArrestsAccess([id], tx)
  const current = await tx.arrest.findUnique({
    where: { id },
    include: {
      arrestee: true,
    },
  })

  const mergedInput = await prepareJsonUpdate(
    'Arrest',
    { action_id, ...input },
    { current }
  )

  if (input.arrestee) {
    mergedInput.arrestee = await prepareJsonUpdate(
      'Arrestee',
      mergedInput.arrestee,
      { current: current.arrestee }
    )
  }

  const data = validateAndPrepareData(
    {
      id,
      action_id,
      ...mergedInput,
    },
    current
  )
  return await tx.arrest.update({
    data,
    include: {
      arrestee: {
        include: {
          created_by: true,
          updated_by: true,
        },
      },
      updated_by: true,
      created_by: true,
      action: true,
    },
    where: { id },
  })
}

export const bulkUpdateArrests = async ({ ids, input }) => {
  const arrests = await checkArrestsAccess(ids)
  const update = async (tx) => {
    const updates = arrests.map(async ({ id, ...arrest }) => {
      const mergedInput = await prepareJsonUpdate(
        'Arrest',
        { ...input, id },
        { tx, current: arrest }
      )
      if (input.arrestee) {
        mergedInput.arrestee = await prepareJsonUpdate(
          'Arrestee',
          mergedInput.arrestee,
          { current: arrest.arrestee, tx }
        )
      }
      const data = await validateAndPrepareData(
        {
          id,
          ...mergedInput,
        },
        arrest
      )

      return tx.arrest.update({
        data,
        where: { id },
      })
    })
    const results = await Promise.all(updates)
    return { count: results.length }
  }

  return db.$transaction(update)
  // if (process.env.NODE_ENV === 'test') {
  //   return update(db)
  // } else {
  // }
}

export const deleteArrest = async ({ id, tx }) => {
  const doDelete = async (tx) => {
    const [arrestRecord] = await checkArrestsAccess([id], tx)

    const res = await tx.arrest.delete({
      where: { id },
    })

    if (arrestRecord?.arrestee?.id) {
      await tx.arrestee.delete({
        where: { id: arrestRecord.arrestee.id },
      })
    }
    return res
  }
  if (tx) {
    return doDelete(tx)
  }
  return db.$transaction(doDelete)
}

export const bulkDeleteArrests = async ({ ids }) => {
  return db.$transaction(async (tx) => {
    const arrests = await checkArrestsAccess(ids, tx)

    // Delete arrests first
    await tx.arrest.deleteMany({
      where: { id: { in: ids } },
    })

    // Then delete associated arrestees
    const arresteeIds = arrests
      .filter((arrest) => arrest.arrestee?.id)
      .map((arrest) => arrest.arrestee.id)

    if (arresteeIds.length > 0) {
      await tx.arrestee.deleteMany({
        where: { id: { in: arresteeIds } },
      })
    }
    return { count: ids.length }
  })
}

export const mergeArrests = async ({ id, input, merge_id }) => {
  await checkArrestsAccess([id, merge_id])
  return db.$transaction(async (tx) => {
    const logs = await tx.log.findMany({
      where: { arrests: { some: { id: merge_id } } },
      select: { id: true },
    })
    const connect = logs.map((d) => ({ id: d.id }))
    const updateInput = { ...input, logs: { connect } }

    const arrest = await updateArrest({ id, input: updateInput, tx })
    await deleteArrest({ id: merge_id, tx })

    return arrest
  })
}

export const Arrest = {
  arrestee: (_obj, { root }) => {
    return db.arrest.findUnique({ where: { id: root?.id } }).arrestee()
  },
  action: (_obj, { root }) => {
    return db.arrest.findUnique({ where: { id: root?.id } }).action()
  },
  created_by: (_obj, { root }) => {
    return db.arrest.findUnique({ where: { id: root?.id } }).created_by()
  },
  updated_by: (_obj, { root }) => {
    return db.arrest.findUnique({ where: { id: root?.id } }).updated_by()
  },
  // display_field: (_obj, { root }) => {
  //   if (root.date) {
  //     return dayjs(root.date).format('L')
  //   }
  // },
}
