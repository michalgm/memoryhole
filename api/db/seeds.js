// api/db/seeds.js
import { hashPassword } from 'src/lib/auth'
import { db } from 'src/lib/db'

const createUser = async () => {
  const hashedPassword = await hashPassword(process.env.SEED_USER_PASSWORD)
  return db.user.create({
    data: {
      email: process.env.SEED_USER_EMAIL,
      password: hashedPassword,
      role: 'Admin',
      name: process.env.SEED_USER_NAME,
    },
  })
}

export const seed = async () => {
  await createUser()
  // ...other seeding logic
}
