import { Database } from '@hocuspocus/extension-database'
import { Server } from '@hocuspocus/server'

import { JWTAuthExtension } from 'src/collab-server/auth'
import { db } from 'src/lib/db'

export const createCollabServer = (options = {}) => {
  const { port = process.env.HOCUSPOCUS_PORT || 1234 } = options

  const extensions = [
    new JWTAuthExtension(),
    new Database({
      async store({ documentName, state, context }) {
        try {
          // Check edit permissions (already validated in auth)
          if (!context?.canEdit) {
            // Don't throw - just silently ignore the save attempt
            return
          }

          const title = context?.title || documentName
          const now = new Date()
          const [type] = documentName.split(/[:-]/, 2)
          const user = context?.user

          await db.document.upsert({
            where: { name: documentName },
            update: {
              content: Buffer.from(state),
              updated_at: now,
              updated_by_id: user?.id ?? null,
              type: type ?? 'wiki',
            },
            create: {
              name: documentName,
              title: title || documentName,
              content: Buffer.from(state),
              created_at: now,
              updated_at: now,
              created_by_id: user?.id ?? 1,
              updated_by_id: user?.id ?? null,
              type: type ?? 'wiki',
              access_role: 'Restricted',
              edit_role: 'Operator',
            },
          })
        } catch (error) {
          console.error('❌ Error storing document:', error)
          // Optionally notify the client/user about the error
          if (context && typeof context.notifySaveError === 'function') {
            context.notifySaveError(`Failed to save document: ${error.message}`)
          }
          // Don't re-throw to prevent server crash
          // Log the error but allow the server to continue
        }
      },

      async fetch({ context }) {
        try {
          // Use cached document from auth (no second DB lookup!)
          const doc = context?.document

          if (!doc) {
            // Document doesn't exist, return null (will be created on first save)
            return null
          }

          // Permissions already checked in auth
          if (!context?.canRead) {
            return null // Return empty document instead of throwing
          }

          return doc.content ? new Uint8Array(doc.content) : null
        } catch (error) {
          console.error('❌ Error fetching document:', error)
          return null // Return null instead of crashing
        }
      },
    }),
  ]

  const server = new Server({
    port,
    extensions,
    quiet: false,
    onConnect: ({ documentName, context, request }) => {
      const url = new URL(request.url, `http://localhost:${port}`)
      const title = url.searchParams.get('title') || documentName
      context.title = title
    },
    // Add global error handler to prevent server crashes
    onError: ({ error }) => {
      console.error('🚨 Hocuspocus server error:', error)
      // Log but don't crash the server
    },
  })

  return server
}

export const startCollabServer = async (options = {}) => {
  const server = createCollabServer(options)
  await server.listen()
  return server
}
