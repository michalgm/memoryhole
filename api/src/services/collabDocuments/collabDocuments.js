import { context } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

export const collabDocuments = () => {
  return db.collabDocument.findMany({
    include: {
      created_by: true,
      last_editor: true,
      parent: true,
    },
    orderBy: {
      updated_at: 'desc',
    },
  })
}

export const collabDocument = ({ id, title }) => {
  if (!id && !title) {
    throw new Error('Either id or title must be provided')
  }

  const where = {}
  if (id) {
    where.id = id
  } else if (title) {
    where.title = title
  }

  return db.collabDocument.findUnique({
    where,
    include: {
      created_by: true,
      last_editor: true,
      parent: true,
      children: true,
    },
  })
}

export const createCollabDocument = ({ input }) => {
  return db.collabDocument.create({
    data: {
      ...input,
      created_by_id: context.currentUser?.id || 1,
      last_edited_by: context.currentUser?.id,
    },
    include: {
      created_by: true,
      last_editor: true,
      parent: true,
    },
  })
}

export const updateCollabDocument = ({ id, input }) => {
  return db.collabDocument.update({
    where: { id },
    data: {
      ...input,
      last_edited_by: context.currentUser?.id,
    },
    include: {
      created_by: true,
      last_editor: true,
      parent: true,
    },
  })
}

export const deleteCollabDocument = ({ id }) => {
  return db.collabDocument.delete({
    where: { id },
    include: {
      created_by: true,
      last_editor: true,
      parent: true,
    },
  })
}
