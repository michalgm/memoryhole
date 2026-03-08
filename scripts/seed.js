import { db } from 'api/src/lib/db'
import {
  optionSetByName,
  updateOptionSetValues,
} from 'api/src/services/optionSets/optionSets'

import { hashPassword } from '@cedarjs/auth-dbauth-api'

async function seedOptions(setName) {
  const envName = `SEED_${setName.toUpperCase()}`
  // eslint-disable-next-line @cedarjs/process-env-computed
  const envValue = process.env[envName] // dynamic key — dot notation not possible here
  if (!envValue) {
    console.error(
      `No ${envName} environment variable found, skipping seeding ${setName}`
    )
    return
  }

  const { id, values } = await optionSetByName({
    name: setName,
  })
  if (values.length !== 0) {
    console.error(`Option set already has values, skipping seeding ${setName}`)
    return
  }
  const items = envValue.split(',').map((value, index) => {
    return {
      value: value.trim(),
      label: value.trim(),
      option_set_id: id,
      order: index + 1,
    }
  })

  updateOptionSetValues({
    id,
    input: {
      values: items,
    },
  })
}

async function seedUsers() {
  const users = [
    {
      email: process.env.SEED_USER_EMAIL,
      role: 'Admin',
      password: process.env.SEED_USER_PASSWORD,
      name: process.env.SEED_USER_NAME,
    },
  ]
  const currentUsers = await db.user.findMany()
  if (currentUsers.length > 0) {
    console.warn('Users already exist in the database, skipping seeding users.')
    return
  }

  // Note: if using PostgreSQL, using `createMany` to insert multiple records is much faster
  // @see: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#createmany
  await Promise.all(
    users.map(async ({ password, ...data }) => {
      const [hashedPassword, salt] = await hashPassword(password)
      const _record = await db.user.create({
        data: { ...data, hashedPassword, salt },
      })
    })
  )
}

export default async () => {
  try {
    //
    // Manually seed via `yarn rw prisma db seed`
    // Seeds automatically with `yarn rw prisma migrate dev` and `yarn rw prisma migrate reset`
    //
    await seedUsers()
    await seedOptions('jurisdictions')
    await seedOptions('cities')
  } catch (error) {
    console.warn('Please define your seed data.')
    console.error(error)
  }
}
