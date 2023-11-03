import {
  Button,
  Divider,
  Tooltip,
  Typography,
} from '@mui/material'
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers'
import {
  _,
  flatMap,
  get,
  isEqual,
  isObject,
  reduce,
  set,
  startCase,
  transform,
} from 'lodash'

import ArresteeLogsCell from '../ArresteeLogsCell/ArresteeLogsCell'
import CreateArresteeLog from '../ArresteeLogsCell/CreateArresteeLog'
import { Field } from '../utils/Field'
import {
  FormContainer,
} from 'react-hook-form-mui'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import dayjs from 'dayjs'
import { useState } from 'react'

const diffObjects = (a, b) => {
  return transform(b, (result, value, key) => {
    if (!isEqual(value, a[key])) {
      result[key] =
        isObject(value) && isObject(a[key]) ? diffObjects(a[key], value) : value
    }
  })
}

const pruneData = (data, fields) => {
  const fieldPaths = flatMap(fields, (section) =>
    section.fields.map((field) => [field[0], field[1]])
  )
  const buildNewObject = (paths, originalData) =>
    reduce(
      paths,
      (result, [path, params = {}]) => {
        let value = get(originalData, path)
        if (value !== undefined) {
          if (['date', 'date-time'].includes(params.field_type)) {
            value = dayjs(value)
          }
          set(result, path, value)
        }
        return result
      },
      {}
    )

  return buildNewObject(fieldPaths, data)
}

function reorderFieldsLodash(fields) {
  const midPoint = Math.ceil(fields.length / 2)
  fields = fields.map(([name, props = {}], index) => [name, props, index])
  const chunks = _.chunk(fields, midPoint)
  const interleaved = _.zip(...chunks)
  const reorderedFields = _.compact(_.flatten(interleaved))
  return reorderedFields
}

const ArresteeArrestForm = (props) => {

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

  const arrestee_fields = [
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

  const values = pruneData(props.arrest, arrestee_fields)
  const onSubmit = (data) => {
    // const diff = diffObjects(props.arrest, data)
    // console.log(data)
    console.warn('SAVING', data)
    props.onSave(data, props?.arrest?.id)
  }

  const formatLabel = (label) => {
    const index = label.lastIndexOf('.')
    return startCase(label.slice(index + 1))
  }

  const fields = arrestee_fields.map(({ fields, title }, groupIndex) => {
    return (
      <Grid xs={12} spacing={2} key={groupIndex} container alignItems={'center'}>
        {title && (
          <Grid xs={12}>
            <Divider
              textAlign="left"
              sx={{ styleOverrides: { 'MuiDivider-root': { width: 5 } } }}
            >
              {title && (
                <Typography variant="h6" gutterBottom>
                  {title}
                </Typography>
              )}
            </Divider>
          </Grid>
        )}
        {reorderFieldsLodash(fields).map(
          ([key, { label, ...options } = {}, index] = []) => {
            return (
              <Grid key={key} xs={6}>
                <Field
                  tabIndex={(100* (groupIndex + 1)) + index}
                  key={key}
                  id={key}
                  label={formatLabel(label || key)}
                  name={key}
                  {...options}
                />
              </Grid>
            )
          }
        )}
      </Grid>
    )
  })
  //  console.log(reorderFieldsLodash(fields)) ||
  const stats = {
    created: dayjs(props?.arrest?.created_at),
    updated: dayjs(props?.arrest?.updated_at),
  }

  const ModTime = ({ time }) => (
    <Typography variant="overline">
      {startCase(time)}&nbsp;
      <Tooltip title={stats[time].format('LLLL')}>
        <b>{stats[time].calendar()}</b>
      </Tooltip>
      &nbsp;by&nbsp;
      <b>{props?.arrest[`${time}_by`]?.name}</b>
    </Typography>
  )

  return (
    <>
      <FormContainer
        defaultValues={values}
        onSuccess={(data) => onSubmit(data)}
      >
        <Grid container spacing={4} className="content-container">
          <Grid xs={12} sx={{ textAlign: 'right', clear: 'both' }}>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </Grid>
          <Grid xs={12} container className="form-content">
            {fields}
          </Grid>
          {
            props.arrest?.id && <>
            <Grid xs={6}>
              <ModTime time="created" />
            </Grid>
            <Grid xs={6}>
              <ModTime time="updated" />
            </Grid>
            </>
          }
        </Grid>
      </FormContainer>
      {props.arrest?.id && <>
        <CreateArresteeLog arrestee_id={props.arrest.arrestee.id} />
        <ArresteeLogsCell arrestee_id={props.arrest.arrestee.id} />
        </>
      }
    </>
  )
}

export default ArresteeArrestForm
