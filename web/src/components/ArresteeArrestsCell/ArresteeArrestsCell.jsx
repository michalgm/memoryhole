import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { useMemo, useState } from 'react'

import ArrestFields from 'src/lib/ArrestFields'
import ArresteeArrestCell from 'src/components/ArresteeArrest'
import { Link } from '@redwoodjs/router'
import dayjs from '../../../../api/src/lib/day'
import { formatLabel } from '../utils/Field'

// import schema from '../../types/graphql'

const fieldTables = {
  arrest: {
    custom_fields: {},
  },
  arrestee: {
    custom_fields: {},
  },
}
const fields = ArrestFields.reduce((acc, { fields }) => {
  fields.forEach(([name, props = {}]) => {
    const type = props.field_type || 'text'
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
    acc[name] = type
  })
  return acc
}, {})
console.log(
  Object.keys(fields)
    .filter((f) => !f.includes('.'))
    .join('\n')
)

export const QUERY = gql`
  query ArresteeArrestsQuery($filters: [GenericFilterInput]) {
    arresteeArrests: filterArrests(filters: $filters) {
      id
      date
      location
      arrest_city
      charges
      citation_number
      jurisdiction
      custom_fields
      arrestee {
        display_field
        first_name
        last_name
        preferred_name
        dob
        pronoun
        email
        phone_1
        phone_2
        address
        city
        state
        zip
        custom_fields
      }
      created_at
      created_by {
        name
      }
      updated_at
      updated_by {
        name
      }
    }
  }
`
// query ArresteeArrestsQuery($filters: [GenericFilterInput]) {
//   arresteeArrests: filterArrests(filters: $filters) {
//     id
//     ${Object.keys(fieldTables.arrest)
//       .filter((f) => f !== 'custom_fields')
//       .join('\n      ')}
//     custom_fields
//     arrestee {
//       display_field
//     ${Object.keys(fieldTables.arrestee)
//       .filter((f) => f !== 'custom_fields')
//       .join('\n        ')}
//     }
//     created_at
//     created_by {
//       name
//     }
//     updated_at
//     updated_by {
//       name
//     }
//   }
// }
// const flattenObject = (obj, parent = '', result = {}) => {
//   for (let key in obj) {
//     if (obj.hasOwnProperty(key)) {
//       let newKey = parent ? `${parent}.${key}` : key
//       if (
//         typeof obj[key] === 'object' &&
//         !Array.isArray(obj[key]) &&
//         obj[key] !== null
//       ) {
//         flattenObject(obj[key], newKey, result)
//       } else {
//         result[newKey] = obj[key]
//       }
//     }
//   }
//   return result
// }

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ arresteeArrests, queryResult: { refetch } }) => {
  const [display_fields, setDisplayFields] = useState([
    'display_name',
    'date',
    'arrest_city',
    'custom_fields.disposition',
    'custom_fields.release_type',
  ])

  const extraCols = Object.keys(fields).map((field) => {
    const type = fields[field]
    const col = {
      accessorKey: field,
      header: formatLabel(field),
    }
    if (type === 'date-time' || type === 'date') {
      col.Cell = ({ cell }) => dayjs(cell.getValue()).format('L')
    }
    return col
  })
  const columns = useMemo(
    () => [
      {
        accessorKey: 'arrestee.display_field',
        // accessorKey: 'arrestee.first_name',
        header: 'Name',
        Cell: ({ cell, row }) => (
          <Link to={`/arrestee-arrest/${row.original.id}`}>
            {cell.getValue()}
          </Link>
        ),
      },
      ...extraCols,
    ],
    []
  )

  const data = arresteeArrests
  const columnVisibility = Object.keys(fields).reduce((acc, f) => {
    acc[f] = display_fields.includes(f)
    return acc
  }, {})
  const table = useMaterialReactTable({
    columns,
    data,
    enableDensityToggle: false,
    muiTableBodyProps: {
      sx: {
        '& tr:nth-of-type(odd) > td': {
          backgroundColor: '#f5f5f5',
        },
      },
    },

    muiPaginationProps: {
      // rowsPerPageOptions: [50, 100, 500],
    },
    initialState: {
      columnVisibility,
      density: 'compact',
      showGlobalFilter: true,
      enableDensityToggle: false,
      sorting: [{ id: 'date', desc: false }],
      pagination: { pageSize: 50, pageIndex: 1 },
    },
  })

  const doFilter = () => {
    refetch({
      filters: [
        {
          field: 'custom_fields.arresting_officer',
          value: 'bad',
          operator: 'string_contains',
        },
        {
          field: 'arrestee.first_name',
          value: 'greg',
          operator: 'contains',
        },
      ],
    })
  }

  return (
    <>
      <Link onClick={doFilter}>Clickme</Link>
      <MaterialReactTable table={table} />
    </>
  )
}
