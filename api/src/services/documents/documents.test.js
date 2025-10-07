import * as Y from 'yjs'

import { db } from 'src/lib/db'

import {
  createDocument,
  deleteDocument,
  document,
  documents,
  updateDocument,
} from './documents'

// Mock the dependencies
jest.mock('src/lib/db', () => ({
  db: {
    document: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

jest.mock('src/lib/auth', () => ({
  requireAuth: jest.fn(),
}))

jest.mock('src/lib/utils', () => ({
  slugify: jest.fn((str) => str.toLowerCase().replace(/\s+/g, '-')),
  validateRoleLevel: jest.fn(() => true),
  checkUserRole: jest.fn(() => true),
}))

jest.mock('@redwoodjs/graphql-server', () => ({
  context: {
    currentUser: {
      id: 1,
      name: 'Test User',
      roles: ['Admin'],
    },
  },
}))

describe('documents', () => {
  let mockUser
  let mockDocument

  beforeEach(() => {
    jest.clearAllMocks()

    // Reset context mock
    const { context } = require('@redwoodjs/graphql-server')
    context.currentUser = {
      id: 1,
      name: 'Test User',
      roles: ['Admin'],
    }

    mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      roles: ['Admin'],
    }

    mockDocument = {
      id: '1',
      name: 'wiki:test-doc',
      title: 'Test Document',
      type: 'wiki',
      content: Buffer.from('test content'),
      html_content: '<p>Test content</p>',
      access_role: 'Restricted',
      edit_role: 'Operator',
      created_at: new Date('2024-01-01'),
      updated_at: new Date('2024-01-02'),
      created_by_id: 1,
      updated_by_id: 1,
      parent_id: null,
      created_by: mockUser,
      updated_by: mockUser,
      parent: null,
      children: [],
    }
  })

  describe('documents()', () => {
    it('returns all documents with includes and ordering', async () => {
      const mockDocuments = [mockDocument]
      db.document.findMany.mockResolvedValue(mockDocuments)

      const result = await documents()

      expect(db.document.findMany).toHaveBeenCalledWith({
        where: {
          access_role: {
            in: ['Restricted', 'Operator', 'Coordinator', 'Admin'],
          },
        },
        include: {
          created_by: true,
          updated_by: true,
          parent: true,
        },
        orderBy: {
          updated_at: 'desc',
        },
      })
      expect(result).toEqual(mockDocuments)
    })

    it('handles empty results', async () => {
      db.document.findMany.mockResolvedValue([])

      const result = await documents()

      expect(result).toEqual([])
    })
  })

  describe('document()', () => {
    it('finds document by id', async () => {
      db.document.findUnique.mockResolvedValue(mockDocument)

      const result = await document({ id: '1' })

      expect(db.document.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          created_by: true,
          updated_by: true,
          parent: true,
          children: true,
        },
      })
      expect(result).toEqual(mockDocument)
    })

    it('finds document by title', async () => {
      db.document.findUnique.mockResolvedValue(mockDocument)

      const result = await document({ title: 'Test Document' })

      expect(db.document.findUnique).toHaveBeenCalledWith({
        where: { title: 'Test Document' },
        include: {
          created_by: true,
          updated_by: true,
          parent: true,
          children: true,
        },
      })
      expect(result).toEqual(mockDocument)
    })

    it('throws error when neither id nor title provided', async () => {
      await expect(() => document({})).rejects.toThrow(
        'Either id or title must be provided'
      )
    })

    it('throws error when both id and title are null/undefined', async () => {
      await expect(() =>
        document({ id: null, title: undefined })
      ).rejects.toThrow('Either id or title must be provided')
    })

    it('prefers id over title when both provided', async () => {
      db.document.findUnique.mockResolvedValue(mockDocument)

      await document({ id: '1', title: 'Test Document' })

      expect(db.document.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          created_by: true,
          updated_by: true,
          parent: true,
          children: true,
        },
      })
    })
  })

  describe('createDocument()', () => {
    const { requireAuth } = require('src/lib/auth')
    const { slugify, checkUserRole } = require('src/lib/utils')

    it('creates document with valid input', async () => {
      const input = {
        title: 'New Document',
        type: 'wiki',
        access_role: 'Restricted',
        edit_role: 'Operator',
      }

      db.document.create.mockResolvedValue({
        ...mockDocument,
        ...input,
        name: 'wiki:new-document',
      })

      const result = await createDocument({ input })

      expect(requireAuth).toHaveBeenCalledWith({ minRole: 'Operator' })
      expect(slugify).toHaveBeenCalledWith('New Document')

      expect(db.document.create).toHaveBeenCalledWith({
        data: {
          ...input,
          name: 'wiki:new-document',
          content: expect.any(Buffer),
          created_by: { connect: { id: 1 } },
          updated_by: { connect: { id: 1 } },
        },
        include: {
          created_by: true,
          updated_by: true,
          parent: true,
        },
      })

      expect(result.name).toBe('wiki:new-document')
    })

    it('uses provided name when given', async () => {
      const input = {
        name: 'custom:my-doc',
        title: 'Custom Document',
        type: 'wiki',
      }

      db.document.create.mockResolvedValue({
        ...mockDocument,
        ...input,
      })

      await createDocument({ input })

      expect(db.document.create).toHaveBeenCalledWith({
        data: {
          ...input,
          content: expect.any(Buffer),
          created_by: { connect: { id: 1 } },
          updated_by: { connect: { id: 1 } },
        },
        include: {
          created_by: true,
          updated_by: true,
          parent: true,
        },
      })
    })

    it('creates empty Yjs document content', async () => {
      const input = {
        title: 'Test Doc',
        type: 'wiki',
      }

      db.document.create.mockResolvedValue(mockDocument)

      await createDocument({ input })

      const createCall = db.document.create.mock.calls[0][0]
      const content = createCall.data.content

      expect(content).toBeInstanceOf(Buffer)
      expect(content.length).toBeGreaterThan(0)

      // Verify it's a valid Yjs document
      const ydoc = new Y.Doc()
      Y.applyUpdate(ydoc, content)
      const fragment = ydoc.getXmlFragment('default')
      expect(fragment.length).toBeGreaterThan(0)
    })

    it('validates role hierarchy (access_role >= edit_role)', async () => {
      // Suppress console output for this error test
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => { })

      const { validateRoleLevel } = require('src/lib/utils')
      validateRoleLevel.mockReturnValue(false)

      const input = {
        title: 'Test Doc',
        type: 'wiki',
        access_role: 'Admin',
        edit_role: 'Restricted', // Invalid: access_role > edit_role
      }

      await expect(createDocument({ input })).rejects.toThrow(
        'Access role must be equal or lower than edit role'
      )

      consoleSpy.mockRestore()
    })

    it('validates user has sufficient role for access_role', async () => {
      requireAuth.mockImplementation(({ minRole }) => {
        if (minRole === 'Admin') {
          throw new Error('Insufficient role')
        }
      })

      const input = {
        title: 'Test Doc',
        type: 'wiki',
        access_role: 'Admin',
      }

      await expect(createDocument({ input })).rejects.toThrow(
        'Document roles exceed your access level'
      )
    })
  })

  describe('updateDocument()', () => {
    const { requireAuth } = require('src/lib/auth')

    it('updates document with valid input', async () => {
      const input = {
        title: 'Updated Title',
        access_role: 'Operator',
      }

      db.document.findUnique.mockResolvedValue({
        edit_role: 'Operator',
      })

      db.document.update.mockResolvedValue({
        ...mockDocument,
        ...input,
      })

      const result = await updateDocument({ id: '1', input })

      expect(db.document.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        select: { edit_role: true },
      })

      expect(requireAuth).toHaveBeenCalledWith({ minRole: 'Operator' })

      expect(db.document.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          ...input,
          updated_by: { connect: { id: 1 } },
        },
        include: {
          created_by: true,
          updated_by: true,
          parent: true,
        },
      })

      expect(result.title).toBe('Updated Title')
    })

    it('requires sufficient role based on document edit_role', async () => {
      db.document.findUnique.mockResolvedValue({
        edit_role: 'Admin',
      })

      requireAuth.mockImplementation(({ minRole }) => {
        if (minRole === 'Admin') {
          throw new Error('Insufficient role')
        }
      })

      const input = { title: 'Updated Title' }

      await expect(updateDocument({ id: '1', input })).rejects.toThrow(
        'Insufficient role'
      )
    })

    it('validates role changes', async () => {
      const { validateRoleLevel } = require('src/lib/utils')
      validateRoleLevel.mockReturnValue(false)

      db.document.findUnique.mockResolvedValue({
        edit_role: 'Operator',
      })

      const input = {
        access_role: 'Admin',
        edit_role: 'Restricted',
      }

      await expect(updateDocument({ id: '1', input })).rejects.toThrow(
        'Access role must be equal or lower than edit role'
      )
    })
  })

  describe('deleteDocument()', () => {
    const { requireAuth } = require('src/lib/auth')

    it('deletes document with sufficient permissions', async () => {
      db.document.findUnique.mockResolvedValue({
        edit_role: 'Operator',
      })

      db.document.delete.mockResolvedValue(mockDocument)

      const result = await deleteDocument({ id: '1' })

      expect(db.document.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        select: { edit_role: true },
      })

      expect(requireAuth).toHaveBeenCalledWith({ minRole: 'Operator' })

      expect(db.document.delete).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          created_by: true,
          updated_by: true,
          parent: true,
        },
      })

      expect(result).toEqual(mockDocument)
    })

    it('requires sufficient role based on document edit_role', async () => {
      db.document.findUnique.mockResolvedValue({
        edit_role: 'Admin',
      })

      requireAuth.mockImplementation(({ minRole }) => {
        if (minRole === 'Admin') {
          throw new Error('Insufficient role')
        }
      })

      await expect(deleteDocument({ id: '1' })).rejects.toThrow(
        'Insufficient role'
      )
    })

    it('handles non-existent document', async () => {
      db.document.findUnique.mockResolvedValue(null)

      await expect(deleteDocument({ id: '999' })).rejects.toThrow()
    })
  })

  describe('Edge cases and error handling', () => {
    it('handles database errors gracefully', async () => {
      db.document.findMany.mockRejectedValue(new Error('Database error'))

      await expect(documents()).rejects.toThrow('Database error')
    })
  })
})
