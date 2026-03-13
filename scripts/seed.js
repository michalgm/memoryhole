import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'

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
  const currentUsers = (await db.user.findMany()) || []
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

async function seedSiteHelp() {
  const existing = await db.siteSetting.findUnique({
    where: { id: 'siteHelp' },
  })
  if (existing?.value && existing.value !== '"Help"') {
    console.warn('siteHelp already has content, skipping.')
    return
  }

  // Load marked via CJS require to bypass vite-node's ESM transform,
  // which mangles class-expression exports from marked's ESM bundle.
  const _require = createRequire(import.meta.url)
  const { marked } = _require('marked')

  const mdPath = join(process.cwd(), 'docs', 'README.md')
  const html = marked.parse(readFileSync(mdPath, 'utf8'))
  await db.siteSetting.upsert({
    where: { id: 'siteHelp' },
    update: { value: html },
    create: { id: 'siteHelp', value: html },
  })
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
    await seedSiteHelp()
  } catch (error) {
    console.warn('Please define your seed data.')
    console.error(error)
  }
}
