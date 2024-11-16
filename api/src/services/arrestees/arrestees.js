import { db } from 'src/lib/db'

export const updateDisplayField = (arrestee, current = {}) => {
  if (arrestee.first_name || arrestee.last_name || arrestee.preferred_name) {
    const combined = { ...current, ...arrestee }
    arrestee.display_field =
      `${combined.first_name || ''} ${combined.last_name || ''}`.trim()
    if (combined.preferred_name) {
      arrestee.display_field = `${combined.preferred_name} (${arrestee.display_field})`
    }
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
  // display_field: (_obj, { root }) => {
  //   console.log(root)
  //   const name = `${root.first_name || ''} ${root.last_name || ''}`.trim()
  //   console.log(name)
  //   return root.preferred_name ? `${root.preferred_name} (${name})` : name
  // },
}
