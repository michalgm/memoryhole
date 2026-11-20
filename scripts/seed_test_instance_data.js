// Fills a Memoryhole instance with fake demo data (actions, arrests with
// arrestees, and logs) through its GraphQL API, so everything goes through
// the same services, validation and display-field logic as the UI.
//
//   PUBLIC_URL=https://test.example.org \
//   IMPORT_USERNAME=admin@example.org IMPORT_PASSWORD=... \
//   yarn cedar exec seed_test_instance_data --arrests 200
//
// PUBLIC_URL and the login default to the values in .env. Options (or the
// matching env vars):
//   --arrests N   arrests to create (DEMO_ARRESTS, default 100)
//   --seed N      faker seed, so runs produce the same people (DEMO_SEED, default 1)
//   --force       add data even if the instance already has arrests (DEMO_FORCE=1)
//
// Records come from the same builders as test and story mocks
// (web/src/test/mocks/mockBuilders.js): field values from codegen.yml (run
// `yarn refresh-mocks` after changing it), custom fields from the field
// definitions. This script only adds the relationships, sensible dates, and
// the instance's own option-set values.

import { fakerEN_US as faker } from '@faker-js/faker'
import { addHours, buildMock } from 'web/src/test/mocks/mockBuilders'

import { apiRequest, logout } from './apiClient.js'

// Set by the API, or by the relationships below; never sent from the mocks
const SERVER_FIELDS = [
  'display_field',
  'search_field',
  'created_by_id',
  'updated_by_id',
  'arrestee_id',
]
const strip = (input) => {
  const out = { ...input }
  SERVER_FIELDS.forEach((field) => delete out[field])
  return out
}

// Overrides without the undefined entries, so the builders' own value is used
// where the instance has no option set to pick from
const defined = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined))

const gql = async (query, variables = {}) => {
  const res = await apiRequest(
    `${process.env.PUBLIC_URL}/.redwood/functions/graphql`,
    { query, variables }
  )
  return res.data.data
}

// --- builders ---------------------------------------------------------------

const buildAction = (ctx) => {
  const start_date = faker.date.past({ years: 1 })
  return buildMock(
    'aCreateActionInput',
    defined({
      start_date,
      end_date: addHours(start_date, faker.number.int({ min: 2, max: 12 })),
      city: ctx.pick('cities'),
      jurisdiction: ctx.pick('jurisdictions'),
    })
  )
}

const buildArrestee = (ctx, previous) => {
  const first_name = faker.person.firstName()
  const last_name = faker.person.lastName()
  const base = {
    first_name,
    last_name,
    preferred_name:
      faker.helpers.maybe(() => faker.person.firstName(), {
        probability: 0.2,
      }) ?? null,
    email: faker.internet.email({
      firstName: first_name,
      lastName: last_name,
      provider: 'example.com',
    }),
    phone_2: null,
    city: ctx.pick('cities'),
    state: ctx.pick('states'),
  }
  // ~5% re-use an earlier person's name and birthday, with different
  // contact details, so the duplicate-arrest tools have something to find
  if (previous.length && faker.datatype.boolean(0.05)) {
    const twin = faker.helpers.arrayElement(previous)
    Object.assign(base, {
      first_name: twin.first_name,
      last_name: twin.last_name,
      dob: twin.dob,
    })
  }
  return strip(buildMock('aCreateArresteeInput', defined(base), ctx))
}

const buildArrest = (ctx, action, previousArrestees) =>
  strip(
    buildMock(
      'aCreateArrestInput',
      defined({
        action_id: action.id,
        date: faker.date.between({
          from: action.start_date,
          to: action.end_date,
        }),
        arrest_city: action.city,
        jurisdiction: action.jurisdiction,
        citation_number:
          faker.helpers.maybe(
            () => faker.string.alphanumeric({ length: 8, casing: 'upper' }),
            { probability: 0.3 }
          ) ?? null,
        arrestee: buildArrestee(ctx, previousArrestees),
      }),
      ctx
    )
  )

const buildLog = (ctx, action, arrestIds) => {
  const time = faker.date.between({
    from: action.start_date,
    to: addHours(action.end_date, 72),
  })
  const type = ctx.pick('log_type')
  return strip(
    buildMock(
      'aCreateLogInput',
      defined({
        action_id: action.id,
        arrests: faker.helpers.arrayElements(arrestIds, { min: 0, max: 3 }),
        type,
        time,
        notes: `<p>${faker.lorem.sentences({ min: 1, max: 4 })}</p>`,
        needs_followup: faker.datatype.boolean(0.2),
        contact:
          faker.helpers.maybe(() => faker.person.fullName(), {
            probability: 0.5,
          }) ?? null,
        shift:
          type === 'Shift Summary'
            ? {
                start_time: addHours(time, -6),
                end_time: time,
                coordinators: faker.helpers
                  .arrayElements(ctx.users, { min: 1, max: 2 })
                  .map(({ id, name }) => ({ id, name })),
                operators: faker.helpers
                  .multiple(() => faker.person.firstName(), { count: 3 })
                  .join(', '),
              }
            : {},
      })
    )
  )
}

// const buildUser = (ctx) => {
//   return strip(
//     buildMock(
//       'aCreateUserInput',
//       defined({
//         name: faker.person.fullName(),
//         email: faker.internet.email(),
//         action_ids: [],
//         access_date_min: null,
//         access_date_max: null,
//         expiresAt: null,
//         role: faker.helpers.arrayElement(['Operator', 'Coordinator', 'Admin']),
//       }),
//       ctx
//     )
//   )
// }
// --- main -------------------------------------------------------------------

export default async ({ args = {} } = {}) => {
  const count = Number(args.arrests ?? process.env.DEMO_ARRESTS ?? 100)
  const seed = Number(args.seed ?? process.env.DEMO_SEED ?? 1)
  const force = Boolean(args.force ?? process.env.DEMO_FORCE)
  faker.seed(seed)

  console.log(`Seeding demo data on ${process.env.PUBLIC_URL}`)

  const existing = await gql(`{
    arrests { id }
    optionSets { name values { value } }
    users { id name }
  }`)
  if (existing.arrests.length && !force) {
    console.log(
      `This instance already has ${existing.arrests.length} arrests; not adding demo data (use --force to add anyway).`
    )
    await logout()
    return
  }

  const options = Object.fromEntries(
    existing.optionSets.map(({ name, values }) => [
      name,
      values.map(({ value }) => value),
    ])
  )
  const ctx = {
    options,
    users: existing.users,
    // A value from the instance's option set, or undefined to keep the mock's
    pick: (set) =>
      options[set]?.length
        ? faker.helpers.arrayElement(options[set])
        : undefined,
  }

  // const userCount = 7
  // const users = []
  // // await db.user.deleteMany({ where: { id: { gt: 1 } } })
  // for (let i = 0; i < userCount; i++) {
  //   const input = buildUser(ctx)
  //   const { createUser } = await gql(
  //     'mutation ($input: CreateUserInput!) { createUser(input: $input) { id } }',
  //     { input }
  //   )
  //   // const newUser = await db.user.create({ data })
  //   // users.push({ ...data })
  //   users.push({ ...input, id: createUser.id })
  // }
  // console.log(users)
  // return

  const actionCount = Math.max(2, Math.ceil(count / 25))
  const actions = []
  for (let i = 0; i < actionCount; i++) {
    const input = buildAction(ctx)
    const { createAction } = await gql(
      'mutation ($input: CreateActionInput!) { createAction(input: $input) { id } }',
      { input }
    )
    actions.push({ ...input, id: createAction.id, arrestIds: [] })
  }
  console.log(`  ${actions.length} actions`)

  const arrestees = []
  for (let i = 0; i < count; i++) {
    const action = faker.helpers.arrayElement(actions)
    const input = buildArrest(ctx, action, arrestees)
    const { createArrest } = await gql(
      'mutation ($input: CreateArrestInput!) { createArrest(input: $input) { id } }',
      { input }
    )
    action.arrestIds.push(createArrest.id)
    arrestees.push(input.arrestee)
    if ((i + 1) % 25 === 0) console.log(`  ${i + 1}/${count} arrests`)
  }
  if (count % 25) console.log(`  ${count}/${count} arrests`)

  const logCount = Math.ceil(count / 2)
  for (let i = 0; i < logCount; i++) {
    const action = faker.helpers.arrayElement(actions)
    await gql(
      'mutation ($input: CreateLogInput!) { createLog(input: $input) { id } }',
      { input: buildLog(ctx, action, action.arrestIds) }
    )
  }
  console.log(`  ${logCount} logs`)

  await logout()

  console.log('Done.')
}
