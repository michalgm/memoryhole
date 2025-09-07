import { Prisma, PrismaClient } from '.prisma/client'

import { emitLogLevels, handlePrismaLogging } from '@redwoodjs/api/logger'

import { logger } from 'src/lib/logger'
import { updateSettingsCache } from 'src/lib/settingsCache'
// import { filterArrestAccess } from 'src/services/arrests/arrests'
// import { filterLogAccess } from 'src/services/logs/logs'

const MUTATION_OPERATIONS = [
  'create',
  'update',
  'delete',
  'upsert',
  'createMany',
  'updateMany',
  'deleteMany',
]
const bypassClient = new PrismaClient({
  log: emitLogLevels(['info', 'warn', 'error']),
})

handlePrismaLogging({
  db: bypassClient,
  logger,
  logLevels: ['info', 'warn', 'error'],
})

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

// export const accessFilter = Prisma.defineExtension((client) => {
//   return client.$extends({
//     name: 'accessFilter',
//     client: {
//       // Add unfiltered query methods
//       $unfilteredQuery: {
//         log: {
//           findMany: (args) => {
//             return bypassClient.log.findMany(args)
//           },
//           findUnique: (args) => {
//             return bypassClient.log.findUnique(args)
//           },
//         },
//         arrest: {
//           findMany: (args) => {
//             return bypassClient.arrest.findMany(args)
//           },
//           findUnique: (args) => {
//             return bypassClient.arrest.findUnique(args)
//           },
//         },
//       },
//     },
//     // query: {
//     //   arrest: {
//     //     async $allOperations({ args, query }) {
//     //       console.log('Filtering arrest query', args)
//     //       if (args.where) {
//     //         args.where = filterArrestAccess(args.where)
//     //       }
//     //       return query(args)
//     //     },
//     //   },
//     //   log: {
//     //     async $allOperations({ args, query }) {
//     //       if (args.where) {
//     //         args.where = filterLogAccess(args.where)
//     //       }

//     //       return query(args)
//     //     },
//     //   },
//     //   // $allModels: {
//     //   //   async $allOperations({ args, query }) {
//     //   //     ;[
//     //   //       ['arrests', filterArrestAccess],
//     //   //       ['logs', filterLogAccess],
//     //   //     ].forEach(([modelName, filterFn]) => {
//     //   //       if (args.include?.[modelName]) {
//     //   //         const include =
//     //   //           args.include[modelName] == true ? {} : args.include[modelName]
//     //   //         const filteredWhere = filterFn(include.where || {})
//     //   //         args.include[modelName] = {
//     //   //           ...include,
//     //   //           where: filteredWhere,
//     //   //         }
//     //   //       }
//     //   //     })
//     //   //     return query(args)
//     //   //   },
//     //   // },
//     // },
//   })
// })

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
  return client.$extends(initExtension).$extends(settingsObserver)
  // .$extends(accessFilter)
}
