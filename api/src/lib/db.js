// See https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/constructor
// for options.

import { PrismaPg } from '@prisma/adapter-pg'
import { Prisma, PrismaClient } from 'api/db/generated/prisma/client.mts'

import { emitLogLevels, handlePrismaLogging } from '@cedarjs/api/logger'

import { applyExtensions } from 'src/lib/db_extensions'

import { logger } from './logger'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

/*
 * Instance of the Prisma Client
 */
const prismaClient = new PrismaClient({
  log: emitLogLevels(['info', 'warn', 'error']),
  transactionOptions: {
    timeout: 15000,
  },
  adapter,
})

handlePrismaLogging({
  db: prismaClient,
  logger,
  logLevels: ['info', 'warn', 'error'],
})

const extendedClient = applyExtensions(prismaClient)
const dbReady = extendedClient.runInitFunctions()
export { extendedClient as db, dbReady, Prisma }
