import { db } from 'api/src/lib/db'

export default async () => {
  const migrationName = '20260129_seed_option_sets'
  console.log(`Attempting to delete migration record: ${migrationName}`)

  try {
    const result =
      await db.$executeRaw`DELETE FROM "_prisma_migrations" WHERE "migration_name" = ${migrationName}`
    console.log(`Deleted ${result} records from _prisma_migrations.`)
  } catch (error) {
    console.error('Error deleting migration record:', error)
  }
}
