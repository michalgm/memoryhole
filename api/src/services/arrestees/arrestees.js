import { merge } from 'lodash'

import { db } from 'src/lib/db'

export const updateDisplayField = (arrestee, current = {}) => {
  if (
    'first_name' in arrestee ||
    'last_name' in arrestee ||
    'preferred_name' in arrestee ||
    (arrestee.custom_fields &&
      'legal_name_confidential' in arrestee.custom_fields)
  ) {
    let {
      first_name = '',
      last_name = '',
      preferred_name = '',
      custom_fields = {},
    } = merge(current, arrestee)
    first_name = first_name ?? ''
    last_name = last_name ?? ''
    preferred_name = preferred_name ?? ''

    let fields = [preferred_name, `(${first_name.trim()})`, last_name]
    if (custom_fields?.legal_name_confidential) {
      fields = [preferred_name, !preferred_name.includes(' ') && last_name, '*']
    }
    arrestee.display_field = fields
      .filter(Boolean)
      .map((name) => name.trim())
      .join(' ')
  }
}

export const arrestees = () => {
  return db.arrestee.findMany()
}

export const arrestee = ({ id }) => {
  return db.arrestee.findUnique({
    where: { id },
  })
}

export const createArrestee = ({ input }) => {
  input.display_field = updateDisplayField(input)

  return db.arrestee.create({
    data: input,
  })
}

export const updateArrestee = ({ id, input }) => {
  input.display_field = updateDisplayField(input)

  return db.arrestee.update({
    data: input,
    where: { id },
  })
}

export const deleteArrestee = ({ id }) => {
  return db.arrestee.delete({
    where: { id },
  })
}

export const Arrestee = {
  created_by: (_obj, { root }) => {
    return db.arrestee.findUnique({ where: { id: root?.id } }).created_by()
  },
  updated_by: (_obj, { root }) => {
    return db.arrestee.findUnique({ where: { id: root?.id } }).updated_by()
  },
  arrests: (_obj, { root }) => {
    return db.arrestee.findUnique({ where: { id: root?.id } }).arrests()
  },
  arrestee_logs: (_obj, { root }) => {
    return db.arrestee.findUnique({ where: { id: root?.id } }).arrestee_logs()
  },
  display_field: (_obj, { root }) => {
    updateDisplayField(root)
    return root.display_field
  },
  search_display_field: (_obj, { root }) => {
    root.custom_fields = root.custom_fields || {}
    root.custom_fields.legal_name_confidential = false
    updateDisplayField(root)
    return root.display_field
  },
}
