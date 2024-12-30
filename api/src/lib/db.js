// See https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/constructor
// for options.

import { PrismaClient } from '@prisma/client'

import { emitLogLevels, handlePrismaLogging } from '@redwoodjs/api/logger'

import { applyExtensions } from 'src/lib/db_extensions'

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

const extendedClient = applyExtensions(prismaClient)
extendedClient.runInitFunctions()
export const db = extendedClient
