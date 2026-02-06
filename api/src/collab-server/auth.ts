import { Extension, onAuthenticatePayload } from '@hocuspocus/server'

import { decryptSession, UserType } from '@cedarjs/auth-dbauth-api'

import { getCurrentUser } from 'src/lib/auth.js'
import { db } from 'src/lib/db.js'
import { checkUserRole } from 'src/lib/utils'

export class JWTAuthExtension implements Extension {
  async onAuthenticate(
    data: onAuthenticatePayload
  ): Promise<{ user: UserType }> {
    const { documentName, context, requestHeaders } = data

    try {
      // Extract and validate session
      const cookies = requestHeaders?.cookie || ''
      const sessionCookie = cookies
        .split(';')
        .map((c) => c.trim())
        .find((c) => c.startsWith(`${process.env.COOKIE_NAME || 'session_'}`))

      if (!sessionCookie) {
        throw new Error('Session cookie required')
      }

      const sessionCookieValue = sessionCookie.substring(
        sessionCookie.indexOf('=') + 1
      )
      const [session] = decryptSession(sessionCookieValue)

      if (!session.id) {
        throw new Error('Invalid session: missing user ID')
      }

      // Get user information
      const user: UserType = await getCurrentUser({ id: session.id })
      if (!user) {
        throw new Error('User not found')
      }

      // Single database lookup for document permissions
      const permissions = await checkDocumentPermissions(documentName, user, db)

      if (!permissions.canRead) {
        throw new Error(
          `Access denied: requires ${permissions.accessRole} role or higher`
        )
      }

      // Store everything in context for use by Database extension
      context.user = user
      context.userId = user.id
      context.canRead = permissions.canRead
      context.canEdit = permissions.canEdit
      context.document = permissions.document
      context.documentPermissions = {
        access_role: permissions.accessRole,
        edit_role: permissions.editRole,
      }
      // IMPORTANT: Set connection as read-only if user can't edit
      if (!permissions.canEdit) {
        data.connectionConfig.readOnly = true
      }

      return { user }
    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`)
    }
  }
}

export const checkDocumentPermissions = async (documentName, user, db) => {
  // Get document permissions from database
  const doc = await db.document.findUnique({
    where: { name: documentName },
    select: {
      content: true,
      access_role: true,
      edit_role: true,
      title: true,
      type: true,
    },
  })

  // For new documents, use default permissions
  const accessRole = doc?.access_role || 'Restricted'
  const editRole = doc?.edit_role || 'Operator'

  // Check permissions
  const canRead = checkUserRole(accessRole, user)
  const canEdit = checkUserRole(editRole, user)

  return {
    document: doc,
    canRead,
    canEdit,
    accessRole,
    editRole,
  }
}
