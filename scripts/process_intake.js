const fs = require('fs/promises')

const axios = require('axios')
const { wrapper } = require('axios-cookiejar-support')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
const apiHost = process.env.PUBLIC_URL
const timezone = require('dayjs/plugin/timezone')
const utc = require('dayjs/plugin/utc')
const { set } = require('lodash')
const { CookieJar } = require('tough-cookie')

const cookieJar = new CookieJar()

dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

const axiosInstance = wrapper(
  axios.create({
    jar: cookieJar, // Use the cookie jar
    withCredentials: true, // Send cookies with requests
  })
)

const fieldMap = {
  legal_first_name: 'arrestee.first_name',
  legal_last_name: 'arrestee.last_name',
  preferred_name: 'arrestee.preferred_name',
  legal_name_confidential: 'arrestee.custom_fields.legal_name_confidential',
  preferred_pronouns: 'arrestee.pronoun',
  birth_date: 'arrestee.dob',
  phone_number: 'arrestee.phone_1',
  email: 'arrestee.email',
  address: 'arrestee.address',
  city: 'arrestee.city',
  state: 'arrestee.state',
  zip: 'arrestee.zip',
  special_needs: 'arrestee.custom_fields.risk_identifier_notes',
  arrest_date: 'date',
  // arrest_time: 'date',
  arrest_city: 'arrest_city',
  arrest_location: 'location',
  charges: 'charges',
  felonies: 'arrestee.custom_fields.felony_charges',
  abuse: 'custom_fields.jail_notes',
  prn: 'custom_fields.jail_id',
  docket: 'custom_fields.docket_number',
  court_date: 'custom_fields.next_court_date',
  // court_time: 'custom_fields.next_court_date',
  court_location: 'custom_fields.next_court_location',
  lawyer_name: 'custom_fields.lawyer',
  lawyer_contact_info: 'custom_fields.lawyer_contact_info',
  notes: 'arrestee.custom_fields.arrestee_notes',
}

const query = `mutation CreateArrestMutation($input: CreateArrestInput!) {
    createArrest(input: $input) {
      id
      arrestee {
        id
    }
  }
}
`

// const data = {
//     legal_first_name: 'Fakey',
//     legal_last_name: 'MacFakePerson',
//     preferred_name: 'fake-o-phone',
//     legal_name_confidential: '',
//     preferred_pronouns: '',
//     birth_date: '1983-01-15',
//     phone_number: '123-234-1234',
//     email: 'john@doe.com',
//     address: '123 Main St',
//     city: 'Oakland',
//     state: 'CA',
//     zip: '94610',
//     special_needs: '',
//     arrest_date: '2024-05-30',
//     arrest_time: '01:56 AM',
//     arrest_city: 'Oakland',
//     arrest_location: '10th and Broadway',
//     charges: '123 Bad cops',
//     felonies: false,
//     abuse: 'Ouch',
//     prn: '12345678',
//     docket: 'AB-123456',
//     court_date: '2024-07-20',
//     court_time: '9:00 AM - Wiley Courthouse',
//     lawyer: '',
//     notes: 'Thank you',
//   }

let id = null

const combineDateTime = (date, time) => {
  return dayjs
    .tz(`${date} ${time}`, 'YYYY-MM-DD hh:mm A', 'America/Los_Angeles')
    .utc()
    .format()
}

const apiRequest = async (url, data, method = 'post') => {
  if (!id && !url.match(/auth$/)) {
    const res = await auth()
    id = res.data.id
  }

  const headers = {
    'Auth-Provider': 'dbAuth',
    Authorization: `Bearer ${id}`,
  }

  return axiosInstance({
    url,
    data,
    method,
    headers,
  })
    .then((response) => {
      if (response.data.errors) {
        throw Error('Error:', response.data.errors.join(' '))
      }
      return response
    })
    .catch((error) => {
      if (error?.response?.data?.errors) {
        console.error(error?.response?.data?.errors)
      } else {
        console.log(error?.response?.data)
      }

      throw Error('Error:', error)
    })
}

const auth = async () => {
  return await apiRequest(`${apiHost}/.redwood/functions/auth`, {
    method: 'login',
    username: process.env.IMPORT_USERNAME,
    password: process.env.IMPORT_PASSWORD,
  })
}

const logout = async () => {
  return await apiRequest(`${apiHost}/.redwood/functions/auth`, {
    method: 'logout',
  })
}

const importRecord = async (data) => {
  const arrest = {
    custom_fields: {
      custody_status: 'Out of Custody',
      release_type: 'Unknown Released',
      disposition: 'Open',
      needs_review: true,
      has_completed_outtake_form: true,
      case_status: 'Unknown',
    },
    arrestee: {
      custom_fields: {},
    },
  }
  Object.keys(data).forEach((key) => {
    if (['arrest_time', 'court_time'].includes(key)) {
      return
    }
    let val = data[key]
    if (val) {
      const path = fieldMap[key]
      if (path) {
        if (key === 'arrest_date') {
          if (data.arrest_time === 'Invalid date') {
            data.arrest_time = '12:00AM'
          }
          val = combineDateTime(data.arrest_date, data.arrest_time)
        } else if (key == 'court_date') {
          if (data.court_time === 'Invalid date') {
            data.court_time = '12:00AM'
          }
          val = combineDateTime(data.court_date, data.court_time)
        } else if (key == 'birth_date') {
          val = dayjs(val, 'YYYY-MM-DD').format()
        }
        set(arrest, path, val)
      } else {
        console.error(`unknown key ${key}`)
      }
    }
  })
  // console.log(arrest)

  await apiRequest(`${apiHost}/.redwood/functions/graphql`, {
    operationName: 'CreateArrestMutation',
    query,
    variables: { input: arrest },
  })
}

// main()

export default async ({ args }) => {
  const file = args._[1]
  console.log(`Importing record from ${file}`)
  const data = await fs.readFile(file, 'utf8')
  const json = JSON.parse(data)
  await importRecord(json)
  await logout()
}
