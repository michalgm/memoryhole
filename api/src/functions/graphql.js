import { authDecoder } from '@redwoodjs/auth-dbauth-api'
import { createGraphQLHandler } from '@redwoodjs/graphql-server'

import directives from 'src/directives/**/*.{js,ts}'
import sdls from 'src/graphql/**/*.sdl.{js,ts}'
import services from 'src/services/**/*.{js,ts}'

import { getCurrentUser } from 'src/lib/auth'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

const trimNestedStrings = (nestedObject) => {
  if (!nestedObject || typeof nestedObject !== 'object') {
    return
  }

  Object.keys(nestedObject).forEach((propertyKey) => {
    if (!Object.prototype.hasOwnProperty.call(nestedObject, propertyKey)) {
      return
    }

    const propertyValue = nestedObject[propertyKey]
    const valueType = typeof propertyValue

    if (valueType === 'string') {
      nestedObject[propertyKey] = propertyValue.trim()
    } else if (Array.isArray(propertyValue)) {
      propertyValue.forEach((item, index) => {
        if (typeof item === 'string') {
          propertyValue[index] = item.trim()
        }
      })
    } else if (valueType === 'object' && propertyValue !== null) {
      trimNestedStrings(propertyValue)
    }
  })
}

const context = async ({ context }) => {
  trimNestedStrings(context?.params?.variables?.input)
}

export const handler = createGraphQLHandler({
  authDecoder,
  getCurrentUser,
  loggerConfig: { logger, options: {} },
  directives,
  sdls,
  services,
  context,
  // allowIntrospection: true,
  onException: () => {
    // Disconnect from your database with an unhandled exception.
    db.$disconnect()
  },
})
