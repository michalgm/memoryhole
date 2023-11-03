import { flatMap, get, reduce, set, startCase } from 'lodash'
import { useMutation, useQuery } from '@redwoodjs/web'

import ArresteeArrest from 'src/components/ArresteeArrest'
import ArresteeArrestForm from 'src/components/ArresteeArrestForm'
import SnackBar from '../utils/SnackBar'
import { Typography } from '@mui/material'
import dayjs from 'dayjs'
import { toast } from '@redwoodjs/web/toast'
import { useState } from 'react'

export const QUERY = gql`
  query EditArresteeArrestById($id: Int!) {
    arresteeArrest: arrest(id: $id) {
      id
      date
      location
      display_field
      search_field
      date
      charges
      arrest_city
      jurisdiction
      citation_number
      arrestee_id
      custom_fields
      created_at
      created_by {
        name
      }
      updated_at
      updated_by {
        name
      }
      arrestee {
        id
        first_name
        last_name
        preferred_name
        pronoun
        dob
        email
        phone_1
        phone_2
        address
        city
        state
        zip
        custom_fields
        # logs {
        #   id
        #   time
        #   type
        #   notes
        #   needs_followup

        # }
        arrests {
          id
        }
      }
    }
  }
`

const UPDATE_ARREST_MUTATION = gql`
  mutation UpdateArresteeArrestMutation($id: Int!, $input: UpdateArrestInput!) {
    updateArrest(id: $id, input: $input) {
      id
      date
      location
      display_field
      search_field
      date
      charges
      arrest_city
      jurisdiction
      citation_number
      arrestee_id
      custom_fields
      arrestee {
        id
        first_name
        last_name
        preferred_name
        pronoun
        dob
        email
        phone_1
        phone_2
        address
        city
        state
        zip
        custom_fields
        arrests {
          id
        }
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ arresteeArrest, id, ...rest }) => {
  // console.log({rest})
  const { data, refetch } = useQuery(QUERY, { variables: { id } })
  const [saving, setSaving] = useState(false)
  // console.log(arresteeArrest.display_field)
  const [updateArrest, { loading, error }] = useMutation(
    UPDATE_ARREST_MUTATION,
    {
      onCompleted: async () => {
        toast.success('Arrest updated')
        // setHasPosted(true)
        setSaving(false)
        setShowSuccess(true)
        // refresh()
        // navigate(routes.arresteeArrest({id: }))
      },
      refetchQueries: [{ query: QUERY, variables: { id } }],
      awaitRefetchQueries: true,
      onError: (error) => {
        setSaving(false)
        console.log(error.message)
        toast.error(error.message)
      },
    }
  )

  const onSave = async (input, id, refresh) => {
    ['updated_at','updated_by', 'created_by', 'created_at', 'search_field', 'display_field', 'id'].forEach(
      (k) => delete input[k]
    )

    setSaving(true)
    return updateArrest({ variables: { id, input, refresh } })
  }
  // console.log(arresteeArrest)
  // if (saving) {
  //   return '...'
  // }
  const usStates = [
    { label: 'Alabama', id: 'AL' },
    { label: 'Alaska', id: 'AK' },
    { label: 'Arizona', id: 'AZ' },
    { label: 'Arkansas', id: 'AR' },
    { label: 'California', id: 'CA' },
    { label: 'Colorado', id: 'CO' },
    { label: 'Connecticut', id: 'CT' },
    { label: 'Delaware', id: 'DE' },
    { label: 'Florida', id: 'FL' },
    { label: 'Georgia', id: 'GA' },
    { label: 'Hawaii', id: 'HI' },
    { label: 'Idaho', id: 'ID' },
    { label: 'Illinois', id: 'IL' },
    { label: 'Indiana', id: 'IN' },
    { label: 'Iowa', id: 'IA' },
    { label: 'Kansas', id: 'KS' },
    { label: 'Kentucky', id: 'KY' },
    { label: 'Louisiana', id: 'LA' },
    { label: 'Maine', id: 'ME' },
    { label: 'Maryland', id: 'MD' },
    { label: 'Massachusetts', id: 'MA' },
    { label: 'Michigan', id: 'MI' },
    { label: 'Minnesota', id: 'MN' },
    { label: 'Mississippi', id: 'MS' },
    { label: 'Missouri', id: 'MO' },
    { label: 'Montana', id: 'MT' },
    { label: 'Nebraska', id: 'NE' },
    { label: 'Nevada', id: 'NV' },
    { label: 'New Hampshire', id: 'NH' },
    { label: 'New Jersey', id: 'NJ' },
    { label: 'New Mexico', id: 'NM' },
    { label: 'New York', id: 'NY' },
    { label: 'North Carolina', id: 'NC' },
    { label: 'North Dakota', id: 'ND' },
    { label: 'Ohio', id: 'OH' },
    { label: 'Oklahoma', id: 'OK' },
    { label: 'Oregon', id: 'OR' },
    { label: 'Pennsylvania', id: 'PA' },
    { label: 'Rhode Island', id: 'RI' },
    { label: 'South Carolina', id: 'SC' },
    { label: 'South Dakota', id: 'SD' },
    { label: 'Tennessee', id: 'TN' },
    { label: 'Texas', id: 'TX' },
    { label: 'Utah', id: 'UT' },
    { label: 'Vermont', id: 'VT' },
    { label: 'Virginia', id: 'VA' },
    { label: 'Washington', id: 'WA' },
    { label: 'West Virginia', id: 'WV' },
    { label: 'Wisconsin', id: 'WI' },
    { label: 'Wyoming', id: 'WY' },
  ]

  const release_types = [
    { label: 'In Custody - Unconfirmed/Pre Cite', id: 'in' },
    { label: 'In Custody - Confirmed No Cite', id: 'confirmed_in' },
    { label: 'Own Recognizance', id: 'or' },
    { label: 'Bail', id: 'bail' },
    { label: 'Cited Out', id: 'cited' },
    { label: 'Arraigned', id: 'arraigned' },
    { label: 'Dismissed', id: 'dismissed' },
    { label: 'Charges Dropped', id: 'charges dropped' },
    { label: 'Charges Pending', id: 'pending' },
    { label: 'Unknown Released', id: 'unkown_released' },
    { label: 'Guilty Plea', id: 'guiltyplea' },
    { label: 'Out With No Complaint', id: 'nocomplant' },
  ]

  const fields = [
    {
      fields: [
        ['arrestee.first_name'],
        ['arrestee.last_name'],
        ['arrestee.preferred_name'],
        ['arrestee.dob', { label: 'date of birth', field_type: 'date' }],
        ['arrestee.pronoun', { label: 'pronouns' }],
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
      ],
    },
    {
      title: 'Contact Info',
      fields: [
        ['arrestee.email'],
        ['arrestee.phone_1'],
        ['arrestee.phone_2'],
        ['arrestee.custom_fields.support_person'],
        ['arrestee.custom_fields.support_contact_info'],
        ['arrestee.address'],
        ['arrestee.city'],
        ['arrestee.state', { field_type: 'select', options: usStates }],
        ['arrestee.zip'],
      ],
    },
    {
      title: 'Arrest Info',
      fields: [
        ['date', { field_type: 'date-time', label: 'arrest date' }],
        ['location'],
        [
          'arrest_city',
          {
            field_type: 'select',
            options: [
              'Oakland',
              'San Francisco',
              'Berkeley',
              'Emeryville',
              'Dublin',
            ],
            required: true,
          },
        ],

        ['custom_fields.arresting_officer'],
        ['custom_fields.badge_number'],
        ['custom_fields.police_report_number'],
        ['charges', { field_type: 'textarea' }],
      ],
    },
    {
      title: 'Jail Info',
      fields: [
        ['custom_fields.jail_facility'],
        ['custom_fields.bail_amount'],
        ['custom_fields.jail_id', { label: 'Booking ID/PFN' }],
        ['custom_fields.release_time', { field_type: 'date-time' }],
        [
          'custom_fields.release_type',
          { field_type: 'select', options: release_types, default: 'in' },
        ],
      ],
    },
    {
      title: 'Case Info',
      fields: [
        ['citation_number'],
        [
          'jurisdiction',
          {
            field_type: 'select',
            options: [
              'San Francisco',
              'Alameda',
              'Federal',
              'Contra Costa',
              'San Mateo',
              'Santa Clara',
              'Marin',
            ],
          },
        ],
        [
          'custom_fields.case_status',
          {
            field_type: 'select',
            default: 'pre_arraignment',
            options: [
              {
                label: 'Pre-Arraignment',
                id: 'pre_arraignment',
              },
              { label: 'No Charges Filed', id: 'no_charges_filed' },
              { label: 'Pre-Trial', id: 'pre_trial' },
              { label: 'Trial', id: 'trial' },
              { label: 'Resolved', id: 'resolved' },
              { label: 'Unknown', id: 'unknown' },
            ],
          },
        ],
        [
          'custom_fields.disposition',
          {
            field_type: 'select',
            default: 'open',
            options: [
              { label: 'Open', id: 'open' },
              {
                label: 'Discharged w/o Prejudice',
                id: 'dischargednoprejudice',
              },
              { label: 'Discharged w/ Prejudice', id: 'discharged' },
              { label: 'Guilty Plea', id: 'guilty plea' },
              { label: 'Dismissed', id: 'dismissed' },
              { label: 'Acquitted', id: 'acquitted' },
              { label: 'Guilty Verdict', id: 'guilty' },
              { label: 'No Action', id: 'noaction' },
              { label: 'Continued for Dismissal', id: 'continued' },
              { label: 'Bench Warrant', id: 'benchwarrant' },
              { label: 'No Complaint FIled', id: 'nocomplaint' },
              { label: 'Warrant Letter', id: 'warrantletter' },
              { label: 'No Contest', id: 'nocontest' },
            ],
          },
        ],
      ],
    },
  ]
  const [showSuccess, setShowSuccess] = useState(false)

  return (
    <div>
      <header>
        <Typography variant="h5">
          Edit Arrestee "{arresteeArrest.display_field}"
        </Typography>
      </header>
      <div>
        <ArresteeArrestForm
          arrest={arresteeArrest}
          // arrest={values}
          onSave={onSave}
          loading={loading}
          error={error}
          fields={fields}
        />
      </div>
      <SnackBar
        open={Boolean(error?.message)}
        severity="error"
        message={error?.message}
      />

      <SnackBar
        open={showSuccess}
        handleClose={() => setShowSuccess(false)}
        severity="success"
        message={'Arrestee Saved!'}
        autoHideDuration={6000}
      />
    </div>
  )
}
