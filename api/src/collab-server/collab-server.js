import { Database } from '@hocuspocus/extension-database'
import { Server } from '@hocuspocus/server'

import { JWTAuthExtension } from 'src/collab-server/auth'
import { db } from 'src/lib/db'

/**
 * Create and configure the Hocuspocus server
 */
export const createCollabServer = (options = {}) => {
  const {
    port = process.env.HOCUSPOCUS_PORT || 1234,
    // enableRedis = false,
    // redisOptions = {},
  } = options

  const extensions = [
    new JWTAuthExtension(),
    new Database({
      async store({ documentName, state, context }) {
        const title = context?.title || documentName
        // Store Yjs state as binary in Postgres
        const now = new Date()
        const [type, _id] = documentName.split(/[:-]/, 2)
        const user = context?.user
        await db.collabDocument.upsert({
          where: { name: documentName },
          update: {
            content: Buffer.from(state),
            updated_at: now,
            last_edited_by: user?.id ?? null,
            type: type ?? 'wiki',
          },
          create: {
            name: documentName,
            title: title || documentName,
            content: Buffer.from(state),
            created_at: now,
            updated_at: now,
            created_by_id: user?.id ?? 1,
            last_edited_by: user?.id ?? null,
            type: type ?? 'wiki',
          },
        })
      },
      async fetch({ documentName }) {
        // Load Yjs state from Postgres
        const doc = await db.collabDocument.findUnique({
          where: { name: documentName },
        })
        if (doc?.content) {
          return new Uint8Array(doc.content)
        }
        return null
      },
    }),
  ]

  const server = new Server({
    port,
    extensions,

    // Additional server configuration
    quiet: false, // Set to true in production to reduce logs
    onConnect: ({ documentName, context, request }) => {
      const url = new URL(request.url, `http://localhost:${port}`)
      const title = url.searchParams.get('title') || documentName
      context.title = title
    },
    // onAuthenticate: AuthenticateRedwoodCookie,
    // Debug connection events
    // onConnect: ({ documentName, context: _context }) => {
    //   console.log('🔗 Client connected to document:', documentName)
    // },

    // onDisconnect: ({ documentName, context: _context }) => {
    //   console.log('� Client disconnected from document:', documentName)
    // },

    // onChange: ({ documentName, document: _document, context: _context }) => {
    //   console.log('📝 Document changed:', documentName, 'Changes detected')
    // },
  })

  return server
}

/**
 * Start the collaboration server
 */
export const startCollabServer = async (options = {}) => {
  const server = createCollabServer(options)

  await server.listen()

  return server
}

// // Auto-start server if this file is run directly
// if (import.meta.url === `file://${process.argv[1]}`) {
//   startCollabServer({
//     port: process.env.COLLAB_PORT || 1234,
//     enableRedis: process.env.REDIS_URL ? true : false,
//     redisOptions: process.env.REDIS_URL ? { host: process.env.REDIS_URL } : {},
//     accessControls: exampleAccessControls,
//   }).catch(console.error)
// }
