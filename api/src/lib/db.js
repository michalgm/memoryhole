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

// Run registered init functions (e.g. warming the settings cache). Called from
// server startup rather than on import: one-off processes that import db
// (data migrations, `cedar exec` scripts) would otherwise leave this query
// running after Cedar shuts down, and Prisma's lazy module loading then crashes
export const initDb = () => extendedClient.runInitFunctions()

export { extendedClient as db, Prisma }
