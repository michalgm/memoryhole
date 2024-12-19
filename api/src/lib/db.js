// See https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/constructor
// for options.

import { PrismaClient } from '@prisma/client'

import { emitLogLevels, handlePrismaLogging } from '@redwoodjs/api/logger'

import { filterArrestAccess } from '../services/arrests/arrests'

import { logger } from './logger'

/*
 * Instance of the Prisma Client
 */
const prismaClient = new PrismaClient({
  log: emitLogLevels(['info', 'warn', 'error']),
})

handlePrismaLogging({
  db: prismaClient,
  logger,
  logLevels: ['info', 'warn', 'error'],
})

export const db = prismaClient.$extends({
  name: 'arrestAccessFilter',
  query: {
    arrest: {
      async $allOperations({ args, query }) {
        if (args.where) {
          args.where = filterArrestAccess(args.where)
        }
        return query(args)
      },
    },
  },
})
