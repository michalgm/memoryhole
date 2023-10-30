// api/db/seeds.js
import { db } from 'src/lib/db'
import { hashPassword } from 'src/lib/auth'

const createUser = async () => {
  const hashedPassword = await hashPassword(process.env.SEED_USER_PASSWORD)
  return db.user.create({
    data: {
      email: process.env.SEED_USER_EMAIL,
      password: hashedPassword,
      role: 'Admin'
    },
  })
}

export const seed = async () => {
  await createUser()
  // ...other seeding logic
}
