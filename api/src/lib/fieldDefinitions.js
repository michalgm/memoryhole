import { ROLE_LEVELS } from '../config'

/**
 * NAMING CONVENTIONS:
 *
 * *Definitions -> "The Config"
 *   - Raw settings, rules, validation, labels, field types.
 *   - Flat object: { 'field.name': { ...props } }
 *
 * *Layout -> "The Visuals"
 *   - Visual organization, tabs, order, grouping.
 *   - Array of sections: [ { title: 'Tab Name', fields: ['field.name', ...] } ]
 *
 * *Schema -> "The Machine Format" (Found in FieldSchemas.jsx)
 *   - Normalized objects with inferred types.
 *   - Used for generating tables, quick lookups, or API introspection.
 */

// -----------------------------------------------------------------------------
// ARREST
// -----------------------------------------------------------------------------

export const ArrestDefinitions = {
  // Arrestee
  'arrestee.first_name': {
    label: 'legal_first_name',
    rules: {
      validate: (value, formValues) =>
        value || formValues.arrestee.preferred_name
          ? null
          : 'Either first or preferred name must be entered',
    },
    onChange: (value, { trigger, formState: { errors } }) => {
      if (value && errors?.arrestee?.preferred_name) {
        trigger(['arrestee.preferred_name'])
      }
    },
  },
  'arrestee.last_name': { label: 'legal_last_name' },
  'arrestee.preferred_name': {
    helperText:
      'Enter both first and last name if preferred last name differs from legal name',
    rules: {
      validate: (value, formValues) =>
        value || formValues.arrestee.first_name
          ? null
          : 'Either first or preferred name must be entered',
    },
    onChange: (value, { trigger, formState: { errors } }) => {
      if (value && errors?.arrestee?.first_name) {
        trigger(['arrestee.first_name'])
      }
    },
  },
  'arrestee.pronoun': { label: 'pronouns' },
  'arrestee.dob': { label: 'date of birth', field_type: 'date' },
  'arrestee.custom_fields.legal_name_confidential': {
    label: 'keep_legal_name_confidential',
    field_type: 'checkbox',
  },
  'custom_fields.needs_review': {
    field_type: 'checkbox',
    helperText: '(For verification of auto-imported arrest records)',
    default: false,
  },
  'custom_fields.has_completed_outtake_form': { field_type: 'checkbox' },
  'arrestee.custom_fields.arrestee_notes': {
    field_type: 'textarea',
    span: 12,
  },

  // Triage Issues
  'arrestee.custom_fields.bipoc': { field_type: 'checkbox' },
  'arrestee.custom_fields.trans/non-binary': { field_type: 'checkbox' },
  'arrestee.custom_fields.medical_needs': { field_type: 'checkbox' },
  'arrestee.custom_fields.houseless': { field_type: 'checkbox' },
  'arrestee.custom_fields.immigration_concerns': { field_type: 'checkbox' },
  'arrestee.custom_fields.legal_history': { field_type: 'checkbox' },
  'arrestee.custom_fields.minor': { field_type: 'checkbox' },
  'arrestee.custom_fields.disability': { field_type: 'checkbox' },
  'arrestee.custom_fields.felony_charges': { field_type: 'checkbox' },
  'arrestee.custom_fields.violent_arrest': {
    field_type: 'checkbox',
    label: 'Violent/Targeted Arrest',
  },
  'arrestee.custom_fields.risk_identifier_notes': {
    field_type: 'textarea',
    span: 12,
    label: 'triage_issues_notes',
  },

  // Contact Info
  'arrestee.email': {
    rules: {
      validate: (value) =>
        !value ||
        /^[^@\s]+@[^.\s]+\.[^\s]+$/.test(value) ||
        'Email must be formatted like an email',
    },
  },
  'arrestee.phone_1': {},
  'arrestee.phone_2': {},
  'arrestee.custom_fields.support_person': {},
  'arrestee.custom_fields.support_contact_info': {},
  'arrestee.custom_fields.affinity_group/support_org': {},
  'arrestee.address': {},
  'arrestee.city': {},
  'arrestee.state': { field_type: 'select', optionSet: 'states' },
  'arrestee.zip': {},
  'arrestee.custom_fields.contact/support_notes': {
    field_type: 'textarea',
    span: 12,
  },

  // Arrest Info
  date: {
    field_type: 'date-time',
    label: 'arrest date',
    rules: { required: true },
    required: true,
  },
  action: { field_type: 'action_chooser', span: 12 },
  location: {},
  arrest_city: {
    field_type: 'select',
    optionSet: 'cities',
    required: true,
  },
  'custom_fields.arresting_officer': {},
  'custom_fields.arresting_agency': {},
  'custom_fields.badge_number': {},
  'custom_fields.police_report_number': {},
  charges: { field_type: 'textarea' },
  'custom_fields.arrest_witnesses': {
    field_type: 'textarea',
    span: 12,
    label: 'Arrest Witnesses and Contact Info',
  },
  'custom_fields.arrest_notes': { field_type: 'textarea', span: 12 },

  // Jail Info
  'custom_fields.custody_status': {
    field_type: 'select',
    optionSet: 'arrest_custody_status',
    required: true,
    rules: {
      validate: (value, formValues) => {
        if (
          formValues.custom_fields?.release_type !== 'Unknown/In Custody' &&
          value !== 'Out of Custody'
        ) {
          return 'Custody status must be updated to "Out of Custody" if release type is not "Unknown/In Custody"'
        }
      },
    },
  },
  'custom_fields.jail_facility': {},
  'arrestee.custom_fields.jail_population': {
    label: 'jail population_assignment',
    field_type: 'select',
    optionSet: 'jail_population',
    default: 'Unknown',
  },
  'custom_fields.jail_id': { label: 'Booking ID/PFN' },
  'custom_fields.bail_amount': {},
  'custom_fields.release_time': { field_type: 'date-time' },
  'custom_fields.release_type': {
    field_type: 'select',
    optionSet: 'arrest_release_type',
    default: 'Unknown/In Custody',
    rules: {
      validate: (value, formValues) => {
        if (
          value === 'Unknown/In Custody' &&
          formValues.custom_fields?.custody_status === 'Out of Custody'
        ) {
          return 'Release type must be set if custody status is "Out of Custody"'
        }
      },
    },
  },
  'custom_fields.bail_notes': { field_type: 'textarea', span: 12 },
  'custom_fields.jail_notes': { field_type: 'textarea', span: 12 },

  // Case Info
  'custom_fields.case_status': {
    field_type: 'select',
    default: 'Pre-Arraignment',
    optionSet: 'arrest_case_status',
  },
  jurisdiction: {
    field_type: 'select',
    optionSet: 'jurisdictions',
  },
  citation_number: {
    helperText: 'Number on their citation (if they received one)',
  },
  'custom_fields.docket_number': {},
  'custom_fields.disposition': {
    field_type: 'select',
    default: 'Open',
    optionSet: 'arrest_disposition',
  },
  'custom_fields.next_court_date': { field_type: 'date-time' },
  'custom_fields.next_court_location': {
    helperText: '(Court name and room)',
  },
  'custom_fields.lawyer': {},
  'custom_fields.lawyer_contact_info': {},
  'custom_fields.case_notes': { field_type: 'textarea', span: 12 },
}

export const ArrestLayout = [
  {
    title: 'Arrestee',
    fields: [
      'arrestee.first_name',
      'arrestee.last_name',
      'arrestee.preferred_name',
      'arrestee.pronoun',
      'arrestee.dob',
      'arrestee.custom_fields.legal_name_confidential',
      'custom_fields.needs_review',
      'custom_fields.has_completed_outtake_form',
      'arrestee.custom_fields.arrestee_notes',
    ],
  },
  {
    title: 'Triage Issues',
    fields: [
      'arrestee.custom_fields.bipoc',
      'arrestee.custom_fields.trans/non-binary',
      'arrestee.custom_fields.medical_needs',
      'arrestee.custom_fields.houseless',
      'arrestee.custom_fields.immigration_concerns',
      'arrestee.custom_fields.legal_history',
      'arrestee.custom_fields.minor',
      'arrestee.custom_fields.disability',
      'arrestee.custom_fields.felony_charges',
      'arrestee.custom_fields.violent_arrest',
      'arrestee.custom_fields.risk_identifier_notes',
    ],
  },
  {
    title: 'Contact Info',
    fields: [
      'arrestee.email',
      'arrestee.phone_1',
      'arrestee.phone_2',
      'arrestee.custom_fields.support_person',
      'arrestee.custom_fields.support_contact_info',
      'arrestee.custom_fields.affinity_group/support_org',
      'arrestee.address',
      'arrestee.city',
      'arrestee.state',
      'arrestee.zip',
      'arrestee.custom_fields.contact/support_notes',
    ],
  },
  {
    title: 'Arrest Info',
    fields: [
      'date',
      'action',
      'location',
      'arrest_city',
      'custom_fields.arresting_officer',
      'custom_fields.arresting_agency',
      'custom_fields.badge_number',
      'custom_fields.police_report_number',
      'charges',
      'custom_fields.arrest_witnesses',
      'custom_fields.arrest_notes',
    ],
  },
  {
    title: 'Jail Info',
    fields: [
      'custom_fields.custody_status',
      'custom_fields.jail_facility',
      'arrestee.custom_fields.jail_population',
      'custom_fields.jail_id',
      'custom_fields.bail_amount',
      'custom_fields.release_time',
      'custom_fields.release_type',
      'custom_fields.bail_notes',
      'custom_fields.jail_notes',
    ],
  },
  {
    title: 'Case Info',
    fields: [
      'custom_fields.case_status',
      'jurisdiction',
      'citation_number',
      'custom_fields.docket_number',
      'custom_fields.disposition',
      'custom_fields.next_court_date',
      'custom_fields.next_court_location',
      'custom_fields.lawyer',
      'custom_fields.lawyer_contact_info',
      'custom_fields.case_notes',
    ],
  },
]

// -----------------------------------------------------------------------------
// USER
// -----------------------------------------------------------------------------

export const UserDefinitions = {
  name: { required: true },
  email: {
    required: true,
    helperText:
      'Password emails will be sent from a Proton Mail account. To ensure end-to-end encryption, it is strongly recommended to use a Proton Mail account for logins.',
  },
  role: {
    field_type: 'select',
    options: ['Operator', 'Coordinator', 'Admin'],
    required: true,
  },
  expiresAt: {
    field_type: 'date-time',
    label: 'Expires At',
    helperText: "User's login will be disabled after this date",
  },
  access_date_threshold: {
    type: 'number',
    rules: {
      setValueAs: (v) => (v === '' ? null : Number(v)),
    },
    label: 'Access Date Threshold',
    endAdornment: 'days',
    helperText:
      'Users will not have access to arrests or logs where the date is older than this many days before the time they view the data.',
  },
  access_date_min: {
    field_type: 'date',
    label: 'Minimum Access Date',
    helperText: 'User will not have access to arrests or logs before this date',
  },
  access_date_max: {
    field_type: 'date',
    label: 'Maximum Access Date',
    helperText: 'User will not have access to arrests or logs after this date',
  },
  actions: {
    field_type: 'action_chooser',
    multiple: true,
    helperText:
      'User will not have access to arrests or logs outside of these actions. If no actions are set, the user will have access to all actions.',
  },
}

export const UserLayout = [
  {
    title: 'User Details',
    fields: ['name', 'email', 'role'],
  },
  {
    title: 'Restrict Access',
    fields: [
      'expiresAt',
      'access_date_threshold',
      'access_date_min',
      'access_date_max',
      'actions',
    ],
  },
]

// -----------------------------------------------------------------------------
// ACTION
// -----------------------------------------------------------------------------

export const ActionDefinitions = {
  name: { required: true },
  description: { field_type: 'richtext' },
  start_date: { field_type: 'date-time', required: true },
  end_date: { field_type: 'date-time' },
  jurisdiction: {
    field_type: 'select',
    optionSet: 'jurisdictions',
    helperText:
      'Sets the default jurisdiction for new arrests created in this action',
  },
  city: {
    field_type: 'select',
    optionSet: 'cities',
    helperText: 'Sets the default city for new arrests created in this action',
  },
}

export const ActionLayout = [
  {
    fields: [
      'name',
      'description',
      'start_date',
      'end_date',
      'jurisdiction',
      'city',
    ],
  },
]

// -----------------------------------------------------------------------------
// DOCUMENT
// -----------------------------------------------------------------------------

export const DocumentDefinitions = {
  name: { required: true },
  title: { required: true },
  type: {
    required: true,
    helperText: 'Document category',
  },
  access_role: {
    field_type: 'select',
    required: true,
    default: 'Restricted',
    helperText: 'Minimum role required to view this document',
    options: [
      { id: 'Restricted', label: 'Restricted' },
      { id: 'Operator', label: 'Operator' },
      { id: 'Coordinator', label: 'Coordinator' },
      { id: 'Admin', label: 'Admin' },
    ],
  },
  edit_role: {
    field_type: 'select',
    required: true,
    default: 'Operator',
    helperText: 'Minimum role required to edit this document',
    options: [
      { id: 'Restricted', label: 'Restricted' },
      { id: 'Operator', label: 'Operator' },
      { id: 'Coordinator', label: 'Coordinator' },
      { id: 'Admin', label: 'Admin' },
    ],
    rules: {
      validate: (value, formValues) => {
        const options = ROLE_LEVELS
        return (
          options.indexOf(value) >= options.indexOf(formValues.access_role) ||
          'Edit role must be equal to or higher than access role'
        )
      },
    },
  },
  html_content: { field_type: 'richtext', label: 'Content' },
}

export const DocumentLayout = [
  {
    fields: [
      'name',
      'title',
      'type',
      'access_role',
      'edit_role',
      'html_content',
    ],
  },
]

// -----------------------------------------------------------------------------
// DUPLICATE ARREST
// -----------------------------------------------------------------------------

export const DuplicateArrestDefinitions = {
  // Score fields
  matchScore: { type: 'number', label: 'Match Score' },
  nameScore: { type: 'number', label: 'Name Score' },
  dobScore: { type: 'number', label: 'DOB Score' },
  emailScore: { type: 'number', label: 'Email Score' },
  phoneScore: { type: 'number', label: 'Phone Score' },
  dateProximityScore: { type: 'number', label: 'Date Proximity Score' },
}

// Merge Arrest definitions into Duplicate definitions (prefixed with 'arrest.')
Object.entries(ArrestDefinitions).forEach(([key, def]) => {
  DuplicateArrestDefinitions[`arrest.${key}`] = { ...def }
})

export const DuplicateArrestLayout = [
  {
    fields: [
      'matchScore',
      'nameScore',
      'dobScore',
      'emailScore',
      'phoneScore',
      'dateProximityScore',
      ...Object.keys(ArrestDefinitions).map((k) => `arrest.${k}`),
    ],
  },
]

// -----------------------------------------------------------------------------
// LOG
// -----------------------------------------------------------------------------

export const LogDefinitions = {
  time: {
    field_type: 'date-time',
    required: true,
  },
  type: {
    field_type: 'select',
    optionSet: 'log_type',
    required: true,
  },
  needs_followup: { field_type: 'checkbox' },
  notes: { field_type: 'richtext', required: true },
  'shift.start_time': { field_type: 'date-time' },
  'shift.end_time': {
    field_type: 'date-time',
    rules: {
      validate: [
        (value, formValues) => {
          const startTime = formValues?.shift?.start_time
          if (value && startTime && value < startTime)
            return 'End time must be after start time'
        },
      ],
    },
  },
  'shift.coordinators': { field_type: 'user_chooser', multiple: true },
  'shift.operators': {},
  action: { field_type: 'action_chooser' },
  arrests: {
    field_type: 'arrest_chooser',
    multiple: true,
  },
}

export const LogLayout = [
  {
    fields: [
      'time',
      'type',
      'needs_followup',
      'notes',
      'shift.start_time',
      'shift.end_time',
      'shift.coordinators',
      'shift.operators',
      'action',
      'arrests',
    ],
  },
]

// -----------------------------------------------------------------------------
// SITE SETTINGS
// -----------------------------------------------------------------------------

export const SiteSettingsDefinitions = {
  id: { label: 'Name' },
  value: {
    label: 'Site Help',
    field_type: 'richtext',
    rows: 10,
  },
}

export const SiteSettingsLayout = [
  {
    fields: ['id', 'value'],
  },
]

export const fieldDefinitions = {
  arrest: ArrestDefinitions,
  user: UserDefinitions,
  action: ActionDefinitions,
  document: DocumentDefinitions,
  duplicate_arrest: DuplicateArrestDefinitions,
  log: LogDefinitions,
  site_settings: SiteSettingsDefinitions,
}
