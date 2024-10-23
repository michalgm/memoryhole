import { merge } from 'lodash'

import { validate, validateWithSync } from '@redwoodjs/api'

import { db } from 'src/lib/db'

import dayjs from '../../lib/day'
import { updateDisplayField as updateArresteeDisplayField } from '../arrestees/arrestees'

// import localizedFormat from 'dayjs/plugin/localizedFormat'

export const arrests = () => {
  return db.arrest.findMany()
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
    where,
  })
}
export const arrest = ({ id }) => {
  return db.arrest.findUnique({
    where: { id },
  })
}

export const searchArrestNames = ({ search }) => {
  return db.arrest.findMany({
    where: {
      OR: search.split(/\s+/).map((term) => ({
        arrestee: {
          display_field: {
            contains: term,
            mode: 'insensitive',
          },
        },
      })),
    },
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

export const createArrest = ({ input: { arrestee, ...arrest } }) => {
  updateDisplayField(arrest)
  updateArresteeDisplayField(arrestee)

  return db.arrest.create({
    data: {
      ...arrest,
      arrestee: {
        create: arrestee,
      },
      updated_by: {
        connect: { id: context.currentUser.id },
      },
      created_by: {
        connect: { id: context.currentUser.id },
      },
    },
  })
}

export const updateArrest = ({
  id,
  input: {
    arrestee: { id: arrestee_id, ...arrestee },
    ...input
  },
}) => {
  validateWithSync(() => {
    if (arrestee.email) {
      validate(arrestee.email, 'Email', { email: true })
    }
  })
  updateDisplayField(input)
  updateArresteeDisplayField(arrestee)

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
      updated_by: {
        connect: { id: context.currentUser.id },
      },
    },
    where: { id },
  })
}

export const bulkUpdateArrests = async ({ ids, input }) => {
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

export const deleteArrest = ({ id }) => {
  return db.arrest.delete({
    where: { id },
  })
}

export const bulkDeleteArrests = async ({ ids }) => {
  return db.arrest.deleteMany({
    where: { id: { in: ids } },
  })
}

export const Arrest = {
  arrestee: (_obj, { root }) => {
    return db.arrest.findUnique({ where: { id: root?.id } }).arrestee()
  },
  created_by: (_obj, { root }) => {
    return db.arrest.findUnique({ where: { id: root?.id } }).created_by()
  },
  updated_by: (_obj, { root }) => {
    return db.arrest.findUnique({ where: { id: root?.id } }).updated_by()
  },
}
