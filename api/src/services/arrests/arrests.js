import { validate, validateWithSync } from '@redwoodjs/api'

import { arrestee } from '../arrestees/arrestees'
import dayjs from '../../lib/day'
import { db } from 'src/lib/db'
import { updateDisplayField as updateAresteeDisplayField } from '../arrestees/arrestees'

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

const updateDisplayField = (arrest) => {
  if (arrest.date) {
    arrest.display_field = dayjs(arrest.date).format('L')
  } else {
    delete arrest.date
  }
}

export const createArrest = ({ input: { arrestee, ...arrest } }) => {
  updateDisplayField(arrest)
  updateAresteeDisplayField(arrestee)

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
  updateAresteeDisplayField(arrestee)

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

export const deleteArrest = ({ id }) => {
  return db.arrest.delete({
    where: { id },
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