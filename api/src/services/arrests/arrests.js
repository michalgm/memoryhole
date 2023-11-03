import { validate, validateWithSync } from '@redwoodjs/api'

import { arrestee } from '../arrestees/arrestees'
import dayjs from '../../lib/day'
import { db } from 'src/lib/db'
import {updateDisplayField as updateAresteeDisplayField} from '../arrestees/arrestees'

// import localizedFormat from 'dayjs/plugin/localizedFormat'

export const arrests = () => {
  return db.arrest.findMany()
}

export const arrest = ({ id }) => {
  return db.arrest.findUnique({
    where: { id },
  })
}

export const searchArrestNames = ({ search }) => {
  return db.arrest.findMany({
    where: {
      display_field: {
        contains: search,
        mode: 'insensitive',
      },
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
  console.log(arrest, arrestee)
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
