import { cloneDeep, fromPairs, sortBy, toPairs } from 'lodash-es'

import {
  ActionDefinitions,
  ArrestDefinitions,
  DocumentDefinitions,
  DuplicateArrestDefinitions,
  LogDefinitions,
  SiteSettingsDefinitions,
  UserDefinitions,
} from 'src/../../api/src/lib/fieldDefinitions'

import { formatLabel } from '../components/utils/BaseField'

// export const fieldTables = {
//   arrest: {
//     custom_fields: {},
//   },
//   arrestee: {
//     custom_fields: {},
//   },
// }

const sortObjectKeys = (obj) => {
  // Convert the object to an array of [key, value] pairs
  const pairs = toPairs(obj)

  // Sort the pairs based on the key
  const sortedPairs = sortBy(pairs, 0)

  // Convert the sorted pairs back to an object
  return fromPairs(sortedPairs)
}

const metaFields = {
  'created_by.name': {
    type: 'text',
    props: { label: 'Created By', readonly: true },
  },
  created_at: {
    type: 'date-time',
    props: { label: 'Created At', readonly: true },
  },
  updated_at: {
    type: 'date-time',
    props: { label: 'Update At', readonly: true },
  },
  'updated_by.name': {
    type: 'text',
    props: { label: 'Updated By', readonly: true },
  },
}

const getSchema = (definitions, includeMetaFields = true) => {
  return Object.entries(definitions).reduce(
    (acc, [name, props]) => {
      // Ensure props is an object
      props = props || {}

      const type = props.field_type || 'text'
      props.label = formatLabel(props.label || name)
      // let [field, custom, table] = name.split('.').reverse()
      // if (!table || !fieldTables[table]) {
      //   if (!custom) {
      //     fieldTables.arrest[field] = type
      //   } else if (custom == 'custom_fields') {
      //     fieldTables.arrest.custom_fields[field] = type
      //   } else if (fieldTables[custom]) {
      //     fieldTables[custom][field] = type
      //   } else {
      //     fieldTables[name] = type
      //   }
      // } else {
      //   fieldTables[table].custom_fields[field] = type
      // }
      acc[name] = { type, props }
      return acc
    },
    includeMetaFields ? cloneDeep(metaFields) : {}
  )
}

export const arrestSchema = sortObjectKeys(
  {
    ...getSchema(ArrestDefinitions),
    ...{
      'arrestee.full_legal_name': {
        type: 'text',
        props: { label: 'Full Legal Name', readonly: true },
      },
      combined_notes: {
        type: 'textarea',
        props: { label: 'Combined Notes', readonly: true, rows: 10 },
      },
    },
  },
  'props.label'
)

export const fieldSchema = {
  arrest: ArrestDefinitions,
  user: UserDefinitions,
  action: ActionDefinitions,
  log: LogDefinitions,
  siteSettings: SiteSettingsDefinitions,
}

export const userSchema = sortObjectKeys(
  getSchema(UserDefinitions, false),
  'props.label'
)

export const actionSchema = sortObjectKeys(
  getSchema(ActionDefinitions, false),
  'props.label'
)
export const documentSchema = sortObjectKeys(
  getSchema(DocumentDefinitions, true),
  'props.label'
)
export const duplicateArrestSchema = sortObjectKeys(
  getSchema(DuplicateArrestDefinitions, false),
  'props.label'
)
