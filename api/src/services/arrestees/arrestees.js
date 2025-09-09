import { merge } from 'lodash'

import { db } from 'src/lib/db'

export const updateDisplayField = (arrestee, current = {}, force) => {
  if (
    'first_name' in arrestee ||
    'last_name' in arrestee ||
    'preferred_name' in arrestee ||
    (arrestee.custom_fields &&
      'legal_name_confidential' in arrestee.custom_fields &&
      !force)
  ) {
    const merged = merge(current, arrestee)
    const custom_fields = merged.custom_fields ?? {}
    let first_name = (merged.first_name ?? '').trim()
    let last_name = (merged.last_name ?? '').trim()
    let preferred_name = (merged.preferred_name ?? '')
      .replace(/ +/g, ' ')
      .trim()
    const confidential = force ? false : custom_fields?.legal_name_confidential
    // Clear redundant names
    if (preferred_name === first_name) {
      first_name = ''
    }
    if (preferred_name === `${first_name} ${last_name}`) {
      first_name = last_name = ''
    }
    if (!confidential) {
      preferred_name = preferred_name.replace(new RegExp(` ${last_name}$`), '')
    }

    let fields = [
      preferred_name,
      preferred_name && first_name ? `(${first_name})` : first_name,
      last_name,
    ]
    if (confidential) {
      fields = [preferred_name || 'Confidential (No preferred name)', '*']
    }

    arrestee.display_field =
      fields.filter(Boolean).join(' ') || 'NO NAME ENTERED'
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
    updateDisplayField(root, {}, true)
    return root.display_field
  },
  full_legal_name: (_obj, { root }) => {
    const first_name = (root.first_name || '').trim()
    const last_name = (root.last_name || '').trim()
    return [first_name, last_name].filter(Boolean).join(' ')
  },
}
