import * as Y from 'yjs'

import { context } from '@redwoodjs/graphql-server'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'
import { slugify, validateRoleLevel } from 'src/lib/utils'

const createEmptyYjsDocument = () => {
  const ydoc = new Y.Doc()
  // Create an empty prosemirror document structure
  const yXmlFragment = ydoc.getXmlFragment('default')
  // Initialize with empty paragraph
  const paragraph = new Y.XmlElement('paragraph')
  yXmlFragment.insert(0, [paragraph])

  // Return the encoded state
  return Buffer.from(Y.encodeStateAsUpdate(ydoc))
}

const validateRoles = (input) => {
  if (input.access_role && input.edit_role) {
    if (!validateRoleLevel(input.access_role, input.edit_role)) {
      throw new Error('Access role must be equal or lower than edit role')
    }
  }
  try {
    if (input.access_role) {
      requireAuth({ minRole: input.access_role })
    }
    if (input.edit_role) {
      requireAuth({ minRole: input.edit_role })
    }
  } catch (error) {
    throw new Error(`Document roles exceed your access level: ${error.message}`)
  }
}

export const documents = async () => {
  return db.document.findMany({
    include: {
      created_by: true,
      updated_by: true,
      parent: true,
    },
    orderBy: {
      updated_at: 'desc',
    },
  })
}

export const document = async ({ id, title }) => {
  if (!id && !title) {
    throw new Error('Either id or title must be provided')
  }

  const where = {}
  if (id) {
    where.id = id
  } else if (title) {
    where.title = title
  }

  return db.document.findUnique({
    where,
    include: {
      created_by: true,
      updated_by: true,
      parent: true,
      children: true,
    },
  })
}

export const createDocument = async ({ input }) => {
  requireAuth({ minRole: 'Operator' })
  validateRoles(input)
  if (!input.name) {
    input.name = `${input.type}:${slugify(input.title)}`
  }
  return db.document.create({
    data: {
      ...input,
      content: createEmptyYjsDocument(),
      created_by: {
        connect: { id: context?.currentUser?.id },
      },
      updated_by: { connect: { id: context?.currentUser?.id } },
    },
    include: {
      created_by: true,
      updated_by: true,
      parent: true,
    },
  })
}

export const updateDocument = async ({ id, input }) => {
  const { edit_role } = await db.document.findUnique({
    where: { id },
    select: { edit_role: true },
  })
  requireAuth({ minRole: edit_role })

  validateRoles(input)

  return db.document.update({
    where: { id },
    data: {
      ...input,
      updated_by: { connect: { id: context?.currentUser?.id } },
    },
    include: {
      created_by: true,
      updated_by: true,
      parent: true,
    },
  })
}

export const deleteDocument = async ({ id }) => {
  const { edit_role } = await db.document.findUnique({
    where: { id },
    select: { edit_role: true },
  })

  requireAuth({ minRole: edit_role })
  return db.document.delete({
    where: { id },
    include: {
      created_by: true,
      updated_by: true,
      parent: true,
    },
  })
}
