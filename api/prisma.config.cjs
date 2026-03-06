const { defineConfig, env } = require('prisma/config')

module.exports = defineConfig({
  schema: 'db/schema.prisma',
  migrations: {
    path: 'db/migrations',
    seed: 'node_modules/.bin/cedar exec seed',
  },
  datasource: {
    url: env('DATABASE_URL'),
    // shadowDatabaseUrl: env('SHADOW_DATABASE_URL'),
  },
})
