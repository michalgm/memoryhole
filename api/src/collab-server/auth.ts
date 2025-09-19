import { Extension, onAuthenticatePayload } from '@hocuspocus/server'

import { decryptSession, UserType } from '@redwoodjs/auth-dbauth-api'

import { getCurrentUser } from 'src/lib/auth.js'
import { db } from 'src/lib/db.js'

export interface AccessControlParams {
  user: UserType
  documentId?: string
  documentName: string
  context?: unknown // Replace 'unknown' with a more specific type if available
}

export interface Configuration {
  accessControlMap: {
    [key: string]: (params: AccessControlParams) => Promise<boolean>
  }
}

/**
 * JWT Authentication Extension for Hocuspocus
 * Validates RedwoodJS JWT tokens and extracts user information
 */
export class JWTAuthExtension implements Extension {
  configuration: Configuration

  constructor(configuration?: Partial<Configuration>) {
    this.configuration = {
      accessControlMap: exampleAccessControls,
      ...configuration,
    }
  }

  async onAuthenticate(
    data: onAuthenticatePayload
  ): Promise<{ user: UserType }> {
    const { documentName, context, requestHeaders } = data
    try {
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
        throw new Error('Invalid token: missing user ID')
      }

      // Get user information using RedwoodJS auth helper
      const user: UserType = await getCurrentUser({ id: session.id })

      if (!user) {
        throw new Error('User not found')
      }

      // Store user information in context for later use
      context.user = user
      context.userId = user.id

      // Custom document access control hook
      const hasAccess = await onDocumentAccess({
        user: context.user,
        documentName,
        context,
        accessControlMap: this.configuration.accessControlMap,
      })

      if (!hasAccess) {
        throw new Error('Access denied to document')
      }

      return { user }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Authentication failed: ${error.message}`)
      }
      throw error
    }
  }

  // async onLoadDocument(_data: onLoadDocumentPayload): Promise<void> { }
  // async onChange(_data: onChangePayload): Promise<void> { }
  // async onConnect(_data: onConnectPayload): Promise<void> { }
  // async onDisconnect(_data: onDisconnectPayload): Promise<void> { }
  // async onRequest(_data: onRequestPayload): Promise<void> { }
  // async onUpgrade(_data: onUpgradePayload): Promise<void> { }
  // async onListen(_data: onListenPayload): Promise<void> { }
  // async onDestroy(_data: onDestroyPayload): Promise<void> { }
  // async onConfigure(_data: onConfigurePayload): Promise<void> { }
}

/**
 * Document Access Control Hook Factory
 * Create custom access control functions for different document types
 */
export const onDocumentAccess = (accessControlMap) => {
  return async ({ user, documentName, context }) => {
    // Extract document type and ID from document name
    const [docType, docId] = documentName.split(/[:-]/, 2)

    // Default access control - user must be authenticated
    if (!user || user.id !== 1) {
      return false
    }

    // If no specific access control defined, allow authenticated users
    if (!accessControlMap || !accessControlMap[docType]) {
      return true
    }

    // Run custom access control function
    const accessControlFn = accessControlMap[docType]
    return await accessControlFn({
      user,
      documentId: docId,
      documentName,
      context,
    })
  }
}

/**
 * Example access control functions
 */
export const exampleAccessControls = {
  // Example: Public documents - anyone authenticated can access
  public: async (params: AccessControlParams) => !!params.user,

  'user-doc': async (params: AccessControlParams) =>
    params.user && params.user.id.toString() === params.documentId,

  'team-doc': async (params: AccessControlParams) => {
    if (!params.user) return false
    try {
      const teamMember = await db.teamMember.findFirst({
        where: {
          userId: params.user.id,
          teamId: params.documentId ? parseInt(params.documentId) : undefined,
        },
      })
      return !!teamMember
    } catch {
      return false
    }
  },

  admin: async (params: AccessControlParams) =>
    params.user &&
    Array.isArray(params.user.roles) &&
    params.user.roles.includes('admin'),
}
