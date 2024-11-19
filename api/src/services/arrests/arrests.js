import { merge } from 'lodash'

import { validate, validateWithSync } from '@redwoodjs/api'
import { ForbiddenError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

import dayjs from '../../lib/day'
import { updateDisplayField as updateArresteeDisplayField } from '../arrestees/arrestees'

// import localizedFormat from 'dayjs/plugin/localizedFormat'

const checkArrestAccess = (arrest) => {
  const {
    action_ids = [],
    arrest_date_min,
    arrest_date_max,
  } = context.currentUser

  if (arrest_date_min && arrest.date < arrest_date_min) {
    throw new ForbiddenError(
      `Arrest date ${arrest.date} is before your minimum access date ${arrest_date_min}`
    )
  }
  if (arrest_date_max && arrest.date > dayjs(arrest_date_max).endOf('day')) {
    throw new ForbiddenError(
      `Arrest date ${arrest.date} is after your maximum access date ${arrest_date_max}`
    )
  }
  if (action_ids.length === 0) return true

  if (!arrest.action_id || !action_ids.includes(arrest.action_id)) {
    throw new ForbiddenError(`You don't have access to arrest id ${arrest.id}`)
  }
}

const checkArrestsAccess = async (ids, tx) => {
  const arrests = await (tx || db).arrest.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      action_id: true,
      date: true,
      custom_fields: true,
      arrestee: {
        select: {
          first_name: true,
          last_name: true,
          preferred_name: true,
          custom_fields: true,
        },
      },
    },
  })

  arrests.forEach((arrest) => {
    checkArrestAccess(arrest)
  })
  return arrests
}

const filterAccess = (baseWhere = {}) => {
  const {
    action_ids = [],
    arrest_date_min,
    arrest_date_max,
  } = context.currentUser
  const where = { ...baseWhere }

  if (arrest_date_min || arrest_date_max) {
    where.date = {
      ...where.date,
      ...(arrest_date_min && { gte: arrest_date_min }),
      ...(arrest_date_max && { lte: arrest_date_max }),
    }
  }

  if (action_ids.length > 0) {
    where.action_id = {
      ...where.action_id,
      in: action_ids,
    }
  }

  return where
}

export const arrests = () => {
  return db.arrest.findMany({
    where: filterAccess({}),
  })
}

export const filterArrests = ({ filters = [] }) => {
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
    where: filterAccess(where),
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

export const searchArrestNames = ({ search }) => {
  const where = {
    OR: search.split(/\s+/).map((term) => ({
      arrestee: {
        display_field: {
          contains: term,
          mode: 'insensitive',
        },
      },
    })),
  }
  return db.arrest.findMany({
    where: filterAccess(where),
  })
}

export const docketSheetSearch = async ({
  date: dateRaw,
  days,
  report_type,
  jurisdiction,
  // include_contact,
}) => {
  const date = dayjs(dateRaw)
  const dateLimit = date.add(days, 'day').toDate()
  const where = {
    jurisdiction,
  }

  // 'arrestee.last_name',
  // 'arrestee.first_name',
  // 'arrestee.preferred_name',
  // 'arrestee.pronoun',
  // 'date',
  // 'citation_number',
  // 'custom_fields.booking_number',
  // 'custom_fields.docket_number',
  // 'arrestee.dob',
  // 'custom_fields.next_court_date',
  // 'charges',
  // 'custom_fields.lawyer',
  // 'custom_fields.bail',
  // 'custom_fields.case_status',
  // 'custom_fields.release_type',

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
  // const select = {
  //   arrestee: {
  //     select: {
  //       first_name: true,
  //       last_name: true,
  //       preferred_name: true,
  //       pronoun: true
  //     }

  // }
  const records = await db.arrest.findMany({
    where,
  })
  return records.filter(({ custom_fields }) => {
    if (report_type === 'arrest_date') {
      return true
    }
    if (custom_fields.next_court_date) {
      const court_date = new Date(custom_fields.next_court_date)
      return court_date >= date && court_date < dateLimit
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
  { id: _id, action_id, arrestee, custom_fields, ...arrest },
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
    if (arrestee.custom_fields) {
      arrestee.custom_fields = merge(
        current.custom_fields,
        arrestee.custom_fields
      )
    }
    data.arrestee = {
      update: {
        data: arrestee,
      },
    }
  }
  if (custom_fields) {
    if (custom_fields.next_court_date) {
      validateWithSync(() => {
        validate(custom_fields.next_court_date, 'Next Court Date', {
          custom: {
            with: (value) => {
              if (!dayjs(value).isValid()) {
                throw new Error('Invalid date')
              }
            },
          },
        })
      })
    }
    data.custom_fields = merge(current.custom_fields, custom_fields)
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
  input: { arrestee, action_id, ...input },
}) => {
  const [arrest] = await checkArrestsAccess([id])
  const data = validateAndPrepareData(
    {
      id,
      action_id,
      arrestee,
      ...input,
    },
    arrest
  )

  return db.arrest.update({
    data,
    where: { id },
  })
}

export const bulkUpdateArrests = async ({ ids, input }) => {
  return db.$transaction(async (tx) => {
    const arrests = await checkArrestsAccess(ids, tx)
    const updates = arrests.map(async ({ id, ...arrest }) => {
      const data = await validateAndPrepareData(
        {
          id,
          ...input,
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
  })
}

export const deleteArrest = async ({ id }) => {
  await arrest({ id })
  return db.arrest.delete({
    where: { id },
  })
}

export const bulkDeleteArrests = async ({ ids }) => {
  await checkArrestsAccess(ids)
  return db.arrest.deleteMany({
    where: {
      id: { in: ids },
    },
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
