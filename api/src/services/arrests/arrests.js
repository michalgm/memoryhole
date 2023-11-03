import { validate, validateWithSync } from '@redwoodjs/api'

import { arrestee } from '../arrestees/arrestees'
import dayjs from 'dayjs'
import { db } from 'src/lib/db'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(localizedFormat)

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


const updateDisplayField = (first, last, preferred, date) => {
  let name = `${first} ${last}`
  if (preferred) {
    name = `${preferred} (${name})`
  }
  if (date) {
    name = `${name} - ${dayjs(date).format('L')}`
  }
  return name
}

export const createArrest = ({ input: { arrestee, arrest } }) => {
  arrest.display_field = updateDisplayField(arrestee.first_name, arrestee.last_name, arrestee.preferred_name, arrest.date)
  arrestee.display_field = updateDisplayField(arrestee.first_name, arrestee.last_name, arrestee.preferred_name)

  return db.arrest.create({
    data: {
      ...arrest,
      arrestee: {
        create: arrestee,
      },
      updated_by: {
        connect: { id: context.currentUser.id }, // Assuming 1 is the ID of the user you want to connect
      },
      created_by: {
        connect: { id: context.currentUser.id }, // Assuming 1 is the ID of the user you want to connect
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

  input.display_field = updateDisplayField(arrestee.first_name, arrestee.last_name, arrestee.preferred_name, input.date)
  arrestee.display_field = updateDisplayField(arrestee.first_name, arrestee.last_name, arrestee.preferred_name)

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
        connect: { id: context.currentUser.id }, // Assuming 1 is the ID of the user you want to connect
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
