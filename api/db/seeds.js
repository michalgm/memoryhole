// api/db/seeds.js
import { hashPassword } from 'src/lib/auth'
import { db } from 'src/lib/db'

const usStates = [
  { label: 'Alabama', value: 'AL' },
  { label: 'Alaska', value: 'AK' },
  { label: 'Arizona', value: 'AZ' },
  { label: 'Arkansas', value: 'AR' },
  { label: 'California', value: 'CA' },
  { label: 'Colorado', value: 'CO' },
  { label: 'Connecticut', value: 'CT' },
  { label: 'Delaware', value: 'DE' },
  { label: 'Florida', value: 'FL' },
  { label: 'Georgia', value: 'GA' },
  { label: 'Hawaii', value: 'HI' },
  { label: 'Idaho', value: 'ID' },
  { label: 'Illinois', value: 'IL' },
  { label: 'Indiana', value: 'IN' },
  { label: 'Iowa', value: 'IA' },
  { label: 'Kansas', value: 'KS' },
  { label: 'Kentucky', value: 'KY' },
  { label: 'Louisiana', value: 'LA' },
  { label: 'Maine', value: 'ME' },
  { label: 'Maryland', value: 'MD' },
  { label: 'Massachusetts', value: 'MA' },
  { label: 'Michigan', value: 'MI' },
  { label: 'Minnesota', value: 'MN' },
  { label: 'Mississippi', value: 'MS' },
  { label: 'Missouri', value: 'MO' },
  { label: 'Montana', value: 'MT' },
  { label: 'Nebraska', value: 'NE' },
  { label: 'Nevada', value: 'NV' },
  { label: 'New Hampshire', value: 'NH' },
  { label: 'New Jersey', value: 'NJ' },
  { label: 'New Mexico', value: 'NM' },
  { label: 'New York', value: 'NY' },
  { label: 'North Carolina', value: 'NC' },
  { label: 'North Dakota', value: 'ND' },
  { label: 'Ohio', value: 'OH' },
  { label: 'Oklahoma', value: 'OK' },
  { label: 'Oregon', value: 'OR' },
  { label: 'Pennsylvania', value: 'PA' },
  { label: 'Rhode Island', value: 'RI' },
  { label: 'South Carolina', value: 'SC' },
  { label: 'South Dakota', value: 'SD' },
  { label: 'Tennessee', value: 'TN' },
  { label: 'Texas', value: 'TX' },
  { label: 'Utah', value: 'UT' },
  { label: 'Vermont', value: 'VT' },
  { label: 'Virginia', value: 'VA' },
  { label: 'Washington', value: 'WA' },
  { label: 'West Virginia', value: 'WV' },
  { label: 'Wisconsin', value: 'WI' },
  { label: 'Wyoming', value: 'WY' },
]

const release_types = [
  { label: 'In Custody - Unconfirmed/Pre Cite', value: 'in' },
  { label: 'In Custody - Confirmed No Cite', value: 'confirmed_in' },
  { label: 'Own Recognizance', value: 'or' },
  { label: 'Bail', value: 'bail' },
  { label: 'Cited Out', value: 'cited' },
  { label: 'Arraigned', value: 'arraigned' },
  { label: 'Dismissed', value: 'dismissed' },
  { label: 'Charges Dropped', value: 'charges dropped' },
  { label: 'Charges Pending', value: 'pending' },
  { label: 'Unknown Released', value: 'unkown_released' },
  { label: 'Guilty Plea', value: 'guiltyplea' },
  { label: 'Out With No Complaint', value: 'nocomplant' },
]

const option_sets = { release_types, usStates }

const importOptionStates = async () => {
  await Promise.all(
    Object.keys(option_sets).map(async (option_set) => {
      return Promise.all(
        option_sets[option_set].map(({ label, value }) => {
          return db.optionSet.create({ option_set, label, value })
        })
      )
    })
  )
}

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
  await importOptionStates()
  // ...other seeding logic
}
