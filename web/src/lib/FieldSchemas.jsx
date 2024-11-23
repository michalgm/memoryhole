import { fromPairs, sortBy, toPairs } from 'lodash-es'

import dayjs from '../../../api/src/lib/day'
import { formatLabel } from '../components/utils/BaseField'

const usStates = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
]

const release_types = [
  'Unknown/In Custody',
  'Own Recognizance',
  'Bail',
  'Cited Out',
  'Arraigned',
  'Dismissed',
  'Charges Dropped',
  'Charges Pending',
  'Unknown Released',
  'Guilty Plea',
  'Out With No Complaint',
]

const cities = [
  'Oakland',
  'San Francisco',
  'Berkeley',
  'Emeryville',
  'Dublin',
  'Hayward',
  'Richmond',
  'San Jose',
  'San Leandro',
  'San Mateo',
  'Santa Cruz',
  'Walnut Creek',
  'Other',
]

const jurisdictions = [
  'San Francisco',
  'Alameda',
  'Federal',
  'Contra Costa',
  'San Mateo',
  'Santa Clara',
  'Santa Cruz',
  'Marin',
  'Yolo',
  'Humboldt',
  'Solano',
  'Sonoma',
  'Napa',
]

const ArrestFields = [
  {
    title: 'Arrestee',
    fields: [
      ['arrestee.first_name', { label: 'legal_first_name' }],
      ['arrestee.last_name', { label: 'legal_last_name' }],
      [
        'arrestee.preferred_name',
        {
          helperText:
            'Enter both first and last name if preferred last name differs from legal name',
        },
      ],
      ['arrestee.pronoun', { label: 'pronouns' }],
      ['arrestee.dob', { label: 'date of birth', field_type: 'date' }],
      [
        'arrestee.custom_fields.legal_name_confidential',
        { label: 'keep_legal_name_confidential', field_type: 'checkbox' },
      ],
      [
        'custom_fields.needs_review',
        {
          field_type: 'checkbox',
          helperText: '(For verification of auto-imported arrest records)',
          default: false,
        },
      ],
      ['custom_fields.has_completed_outtake_form', { field_type: 'checkbox' }],
      [
        'arrestee.custom_fields.arrestee_notes',
        { field_type: 'textarea', span: 12 },
      ],
    ],
  },
  {
    title: 'Triage Issues',
    fields: [
      ['arrestee.custom_fields.bipoc', { field_type: 'checkbox' }],
      ['arrestee.custom_fields.trans/non-binary', { field_type: 'checkbox' }],
      ['arrestee.custom_fields.medical_needs', { field_type: 'checkbox' }],
      ['arrestee.custom_fields.houseless', { field_type: 'checkbox' }],
      [
        'arrestee.custom_fields.immigration_concerns',
        { field_type: 'checkbox' },
      ],
      ['arrestee.custom_fields.legal_history', { field_type: 'checkbox' }],
      ['arrestee.custom_fields.minor', { field_type: 'checkbox' }],
      ['arrestee.custom_fields.disability', { field_type: 'checkbox' }],
      ['arrestee.custom_fields.felony_charges', { field_type: 'checkbox' }],
      [
        'arrestee.custom_fields.violent_arrest',
        { field_type: 'checkbox', label: 'Violent/Targeted Arrest' },
      ],

      // [],
      [
        'arrestee.custom_fields.risk_identifier_notes',
        { field_type: 'textarea', span: 12, label: 'triage_issues_notes' },
      ],
    ],
  },
  {
    title: 'Contact Info',
    fields: [
      [
        'arrestee.email',
        {
          validation: {
            validate: (value) =>
              !value ||
              /^[^@\s]+@[^.\s]+\.[^\s]+$/.test(value) ||
              'Email must be formatted like an email',
          },
        },
      ],
      ['arrestee.phone_1'],
      ['arrestee.phone_2'],
      ['arrestee.custom_fields.support_person'],
      ['arrestee.custom_fields.support_contact_info'],
      ['arrestee.custom_fields.affinity_group/support_org'],
      ['arrestee.address'],
      ['arrestee.city'],
      ['arrestee.state', { field_type: 'select', options: usStates }],
      ['arrestee.zip'],
      [
        'arrestee.custom_fields.contact/support_notes',
        { field_type: 'textarea', span: 12 },
      ],
    ],
  },
  {
    title: 'Arrest Info',
    fields: [
      [
        'date',
        {
          field_type: 'date-time',
          label: 'arrest date',
          validation: { required: true },
          required: true,
        },
      ],
      ['action', { type: 'number', field_type: 'action_chooser', span: 12 }],
      ['location'],
      [
        'arrest_city',
        {
          field_type: 'select',
          options: cities,
          required: true,
        },
      ],

      ['custom_fields.arresting_officer'],
      ['custom_fields.arresting_agency'],
      ['custom_fields.badge_number'],
      ['custom_fields.police_report_number'],
      ['charges', { field_type: 'textarea' }],
      [
        'custom_fields.arrest_witnesses',
        {
          field_type: 'textarea',
          span: 12,
          label: 'Arrest Witnesses and Contact Info',
        },
      ],
      ['custom_fields.arrest_notes', { field_type: 'textarea', span: 12 }],
    ],
  },
  {
    title: 'Jail Info',
    fields: [
      [
        'custom_fields.custody_status',
        {
          field_type: 'select',
          options: ['Unknown/Unconfirmed', 'In Custody', 'Out of Custody'],
          default: 'Unknown/Unconfirmed',
        },
      ],
      ['custom_fields.jail_facility'],
      [
        'arrestee.custom_fields.jail_population',
        {
          label: 'jail population_assignment',
          field_type: 'select',
          options: [
            'Male',
            'Female',
            'Transgender/Gender Variant/Non-Binary',
            'Unknown',
          ],
          default: 'Unknown',
        },
      ],
      ['custom_fields.jail_id', { label: 'Booking ID/PFN' }],
      ['custom_fields.bail_amount'],
      ['custom_fields.release_time', { field_type: 'date-time' }],
      [
        'custom_fields.release_type',
        {
          field_type: 'select',
          options: release_types,
          default: 'Unknown/In Custody',
        },
      ],
      ['custom_fields.bail_notes', { field_type: 'textarea', span: 12 }],
      ['custom_fields.jail_notes', { field_type: 'textarea', span: 12 }],
    ],
  },
  {
    title: 'Case Info',
    fields: [
      [
        'custom_fields.case_status',
        {
          field_type: 'select',
          default: 'Pre-Arraignment',
          options: [
            'Pre-Arraignment',
            'No Charges Filed',
            'Pre-Trial',
            'Trial',
            'Resolved',
            'Unknown',
          ],
        },
      ],
      [
        'jurisdiction',
        {
          field_type: 'select',
          options: jurisdictions,
        },
      ],
      [
        'citation_number',
        { helperText: 'Number on their citation (if they received one)' },
      ],
      ['custom_fields.docket_number'],

      [
        'custom_fields.disposition',
        {
          field_type: 'select',
          default: 'Open',
          options: [
            'Open',
            'Discharged w/o Prejudice',
            'Discharged w/ Prejudice',
            'Guilty Plea',
            'Dismissed',
            'Acquitted',
            'Guilty Verdict',
            'No Action',
            'Continued for Dismissal',
            'Bench Warrant',
            'No Complaint FIled',
            'Warrant Letter',
            'No Contest',
          ],
        },
      ],
      ['custom_fields.next_court_date', { field_type: 'date-time' }],
      [
        'custom_fields.next_court_location',
        {
          helperText: '(Court name and room)',
        },
      ],
      ['custom_fields.lawyer'],
      ['custom_fields.lawyer_contact_info'],
      ['custom_fields.case_notes', { field_type: 'textarea', span: 12 }],
    ],
  },
]

export const fieldTables = {
  arrest: {
    custom_fields: {},
  },
  arrestee: {
    custom_fields: {},
  },
}

const sortObjectKeys = (obj) => {
  // Convert the object to an array of [key, value] pairs
  const pairs = toPairs(obj)

  // Sort the pairs based on the key
  const sortedPairs = sortBy(pairs, 0)

  // Convert the sorted pairs back to an object
  return fromPairs(sortedPairs)
}

const getSchema = (fields) => {
  return fields.reduce((acc, { fields }) => {
    fields.forEach(([name, props = {}]) => {
      const type = props.field_type || 'text'
      props.label = formatLabel(props.label || name)
      let [field, custom, table] = name.split('.').reverse()
      if (!table) {
        if (!custom) {
          fieldTables.arrest[field] = type
        } else if (custom == 'custom_fields') {
          fieldTables.arrest.custom_fields[field] = type
        } else {
          fieldTables[custom][field] = type
        }
      } else {
        fieldTables[table].custom_fields[field] = type
      }
      acc[name] = { type, props }
    })
    return acc
  }, {})
}

export const schema = sortObjectKeys(
  {
    ...getSchema(ArrestFields),
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
  },
  // ArrestFields.reduce(
  //   (acc, { fields }) => {
  //     fields.forEach(([name, props = {}]) => {
  //       const type = props.field_type || 'text'
  //       props.label = formatLabel(props.label || name)
  //       let [field, custom, table] = name.split('.').reverse()
  //       if (!table) {
  //         if (!custom) {
  //           fieldTables.arrest[field] = type
  //         } else if (custom == 'custom_fields') {
  //           fieldTables.arrest.custom_fields[field] = type
  //         } else {
  //           fieldTables[custom][field] = type
  //         }
  //       } else {
  //         fieldTables[table].custom_fields[field] = type
  //       }
  //       acc[name] = { type, props }
  //     })
  //     return acc
  //   },
  //   {
  //     'created_by.name': {
  //       type: 'text',
  //       props: { label: 'Created By', readonly: true },
  //     },
  //     created_at: {
  //       type: 'date-time',
  //       props: { label: 'Created At', readonly: true },
  //     },
  //     updated_at: {
  //       type: 'date-time',
  //       props: { label: 'Update At', readonly: true },
  //     },
  //     'updated_by.name': {
  //       type: 'text',
  //       props: { label: 'Updated By', readonly: true },
  //     },
  //   }
  // ),
  'props.label'
)

export const UserFields = [
  {
    title: 'User Details',
    fields: [
      ['name', { required: true }],
      ['email', { required: true }],
      [
        'role',
        {
          field_type: 'select',
          options: ['User', 'Admin'],
          required: true,
        },
      ],
    ],
  },
  {
    title: 'Restrict Access',
    fields: [
      [
        'expiresAt',
        {
          field_type: 'date-time',
          label: 'Expires At',
          helperText: "User's login will be disabled after this date",
        },
      ],
      [
        'actions',
        {
          field_type: 'select',
          multiple: true,
          query: {
            model: 'action',
            orderBy: {
              start_date: 'desc',
            },
            searchField: 'name',
          },
          storeFullObject: true,
          autocompleteProps: {
            getOptionLabel: (option) => {
              const date = dayjs(option.start_date).format('L LT')
              return `${option.name} (${date})`
            },
          },
          helperText:
            'User will not have access to arrests outside of these actions. If no actions are set, the user will have access to all actions.',
        },
      ],
      [
        'arrest_date_min',
        {
          field_type: 'date',
          label: 'Minimum Arrest Date',
          helperText: 'User will not have access to arrests before this date',
        },
      ],
      [
        'arrest_date_max',
        {
          field_type: 'date',
          label: 'Maximum Arrest Date',
          helperText: 'User will not have access to arrests after this date',
        },
      ],
    ],
  },
]

export const ActionFields = [
  {
    fields: [
      ['name', { required: true }],
      ['description', { field_type: 'richtext' }],
      ['start_date', { field_type: 'date-time', required: true }],
      ['end_date', { field_type: 'date-time' }],
      [
        'jurisdiction',
        {
          field_type: 'select',
          options: jurisdictions,
          helperText:
            'Sets the default jurisdiction for new arrests created in this action',
        },
      ],
      [
        'city',
        {
          field_type: 'select',
          options: cities,
          helperText:
            'Sets the default city for new arrests created in this action',
        },
      ],
    ],
  },
]

export default ArrestFields

export const userSchema = sortObjectKeys(getSchema(UserFields), 'props.label')
export const actionSchema = sortObjectKeys(
  getSchema(ActionFields),
  'props.label'
)
