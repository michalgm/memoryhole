const { defineConfig } = require('prisma/config')

module.exports = defineConfig({
  schema: 'db/schema.prisma',
  migrations: {
    path: 'db/migrations',
    seed: 'node_modules/.bin/cedar exec seed',
  },
})
