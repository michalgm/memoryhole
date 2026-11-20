// Shared fake-data builders for tests, stories (via generateMockData) and the
// demo seed (scripts/seed_test_instance_data.js).
//
// The builders in ./generated come from the GraphQL schema (codegen.yml), which
// only knows custom_fields as JSON. buildMock() fills those from the field
// definitions instead, so records get the custom fields the app actually uses.
// Keep this free of web-only imports: the seed script runs it under Node.

import { fakerEN_US as faker } from '@faker-js/faker'
import { get, set } from 'lodash-es'

import { ArrestDefinitions } from '../../../../api/src/lib/fieldDefinitions'

import * as generated from './generated'

const HOUR = 60 * 60 * 1000
export const addHours = (date, hours) =>
  new Date(new Date(date).getTime() + hours * HOUR)

// Plain-text custom fields get values that look like their names
const textValue = (name) => {
  if (/officer|lawyer$|support_person/.test(name)) {
    return faker.person.fullName()
  }
  if (/contact_info/.test(name)) {
    return faker.phone.number({ style: 'national' })
  }
  if (/badge|jail_id|docket|report_number/.test(name)) {
    return faker.string.numeric(6)
  }
  if (/bail_amount/.test(name)) {
    return `$${faker.number.int({ min: 1, max: 50 }) * 1000}`
  }
  if (/agency/.test(name)) {
    return faker.helpers.arrayElement(['City PD', 'County Sheriff', 'CHP'])
  }
  if (/facility|court_location/.test(name)) {
    return `${faker.location.city()} ${faker.helpers.arrayElement(['Jail', 'Courthouse'])}`
  }
  return faker.helpers.maybe(() => faker.lorem.words(3), { probability: 0.5 })
}

/**
 * custom_fields for one record, from the ArrestDefinitions entries under
 * `prefix` ('custom_fields.' for an arrest, 'arrestee.custom_fields.').
 * Select fields pick from `options` ({ optionSetName: [values] }) when given,
 * else use the field's default; dates are relative to `date`.
 */
export const customFields = (
  prefix,
  { options = {}, date = new Date() } = {}
) => {
  const fields = {}
  for (const [key, def] of Object.entries(ArrestDefinitions)) {
    if (!key.startsWith(prefix)) continue
    const name = key.slice(prefix.length)
    let value
    switch (def.field_type) {
      case 'checkbox':
        value = faker.datatype.boolean(0.15)
        break
      case 'select':
        value = options[def.optionSet]?.length
          ? faker.helpers.arrayElement(options[def.optionSet])
          : def.default
        break
      case 'date':
      case 'date-time':
        value =
          name === 'next_court_date'
            ? faker.helpers.maybe(() => faker.date.soon({ days: 90 }), {
                probability: 0.7,
              })
            : faker.date.between({ from: date, to: addHours(date, 48) })
        break
      case 'textarea':
        value = faker.helpers.maybe(() => faker.lorem.sentences(2), {
          probability: 0.4,
        })
        break
      default:
        value = textValue(name)
    }
    if (value !== undefined) fields[name] = value
  }
  // The arrest form requires this pairing
  if (
    fields.release_type &&
    fields.release_type !== 'Unknown/In Custody' &&
    options.arrest_custody_status?.includes('Out of Custody')
  ) {
    fields.custody_status = 'Out of Custody'
  }
  return fields
}

// Where each mock type keeps custom fields, and their definitions prefix
const ARREST = {
  custom_fields: 'custom_fields.',
  'arrestee.custom_fields': 'arrestee.custom_fields.',
}
const ARRESTEE = { custom_fields: 'arrestee.custom_fields.' }
const CUSTOM_FIELD_PATHS = {
  anArrest: ARREST,
  aCreateArrestInput: ARREST,
  anUpdateArrestInput: ARREST,
  anArrestee: ARRESTEE,
  aCreateArresteeInput: ARRESTEE,
  anUpdateArresteeInput: ARRESTEE,
}

// JSON fields the schema can't describe; the generated mocks fill them with
// a lorem word, which no component expects
const JSON_FIELDS = ['custom_fields', 'shift']

/**
 * A generated mock (e.g. 'anArrest', 'aCreateLogInput') with realistic
 * custom fields. `overrides` work as for the generated builders: a given
 * field replaces the generated one, and custom fields are only generated
 * where `overrides` doesn't supply them.
 */
export const buildMock = (method, overrides = {}, { options } = {}) => {
  const builder = generated[method]
  if (!builder) throw new Error(`No generated mock named ${method}`)
  const data = builder(overrides)

  const date = data.date ?? data.time ?? new Date()
  for (const [path, prefix] of Object.entries(
    CUSTOM_FIELD_PATHS[method] ?? {}
  )) {
    const parent = path.split('.').slice(0, -1).join('.')
    if (parent && typeof get(data, parent) !== 'object') continue
    if (get(overrides, path) !== undefined) continue
    set(data, path, customFields(prefix, { options, date }))
  }
  for (const field of JSON_FIELDS) {
    if (typeof data[field] === 'string' && !(field in overrides)) {
      data[field] = {}
    }
  }
  return data
}
