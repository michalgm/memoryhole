import { Prisma } from '.prisma/client'

import { updateSettingsCache } from 'src/lib/settingsCache'

import { filterArrestAccess } from '../services/arrests/arrests'

const MUTATION_OPERATIONS = [
  'create',
  'update',
  'delete',
  'upsert',
  'createMany',
  'updateMany',
  'deleteMany',
]

export const settingsObserver = Prisma.defineExtension((client) => {
  client.registerInit((client) => updateSettingsCache(client))

  return client.$extends({
    name: 'settingsObserver',
    query: {
      siteSetting: {
        async $allOperations({ operation, args, query }) {
          const result = await query(args)

          // Only update cache for mutations
          if (MUTATION_OPERATIONS.includes(operation)) {
            updateSettingsCache(client)
          }
          return result
        },
      },
    },
  })
})

export const arrestAccessFilter = Prisma.defineExtension((client) => {
  return client.$extends({
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
})

export const initExtension = Prisma.defineExtension((client) => {
  const initFunctions = []

  return client.$extends({
    name: 'initExtension',
    client: {
      registerInit(fn) {
        initFunctions.push(fn)
      },
      async runInitFunctions() {
        await new Promise((resolve) => setTimeout(resolve, 200))
        await Promise.all(initFunctions.map((fn) => fn(client)))
      },
    },
  })
})

export const applyExtensions = (client) => {
  return client
    .$extends(initExtension)
    .$extends(settingsObserver)
    .$extends(arrestAccessFilter)
}
