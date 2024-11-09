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
  if (arrest_date_max && arrest.date > arrest_date_max) {
    throw new ForbiddenError(
      `Arrest date ${arrest.date} is after your maximum access date ${arrest_date_max}`
    )
  }
  if (action_ids.length === 0) return true

  if (!arrest.action_id || !action_ids.includes(arrest.action_id)) {
    throw new ForbiddenError(`You don't have access to arrest id ${arrest.id}`)
  }
}

const checkArrestsAccess = async (ids) => {
  const arrests = await db.arrest.findMany({
    where: { id: { in: ids } },
    select: { id: true, action_id: true, date: true },
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

export const createArrest = ({ input: { arrestee, action_id, ...arrest } }) => {
  checkArrestAccess({ ...arrest, action_id })
  updateDisplayField(arrest)
  updateArresteeDisplayField(arrestee)
  const action = action_id ? { connect: { id: action_id } } : {}
  return db.arrest.create({
    data: {
      ...arrest,
      arrestee: {
        create: arrestee,
      },
      action,
      updated_by: {
        connect: { id: context.currentUser.id },
      },
      created_by: {
        connect: { id: context.currentUser.id },
      },
    },
  })
}

export const updateArrest = async ({
  id,
  input: {
    arrestee: { id: arrestee_id, ...arrestee },
    action_id,
    ...input
  },
}) => {
  await arrest({ id })

  validateWithSync(() => {
    if (arrestee.email) {
      validate(arrestee.email, 'Email', { email: true })
    }
  })
  updateDisplayField(input)
  updateArresteeDisplayField(arrestee)
  const action = action_id ? { connect: { id: action_id } } : {}

  return db.arrest.update({
    data: {
      ...input,
      // updated_by_id: context.currentUser.id,
      arrestee: {
        update: {
          data: arrestee,
          where: { id: arrestee_id },
        },
      },
      action,
      updated_by: {
        connect: { id: context.currentUser.id },
      },
    },
    where: { id },
  })
}

export const bulkUpdateArrests = async ({ ids, input }) => {
  checkArrestsAccess(ids)
  const arrests = await db.arrest.findMany({
    where: {
      id: { in: ids },
    },
    include: {
      arrestee: true,
    },
  })
  const res = await db.$transaction(
    arrests.map(({ id, ...arrest }) => {
      ;[
        'id',
        'arrestee_id',
        'created_by_id',
        'updated_by_id',
        'updated_at',
        'created_at',
      ].forEach((key) => {
        delete arrest[key]
        delete arrest.arrestee[key]
      })
      const arrest_input = merge(arrest, input)

      return updateArrest({
        id,
        input: arrest_input,
      })
    })
  )
  return { count: res.length }
}

export const deleteArrest = async ({ id }) => {
  await arrest({ id })
  return db.arrest.delete({
    where: { id },
  })
}

export const bulkDeleteArrests = async ({ ids }) => {
  checkArrestsAccess(ids)
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
}
