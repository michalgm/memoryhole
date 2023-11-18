import { useMemo, useState } from 'react'

import { FileDownload } from '@mui/icons-material'
import { Box, Button } from '@mui/material'
import { download, generateCsv, mkConfig } from 'export-to-csv' //or use your library of choice here
import _ from 'lodash'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'

import { routes } from '@redwoodjs/router'

import { fieldTables, schema } from 'src/lib/ArrestFields'

import dayjs from '../../../../api/src/lib/day'
import { formatLabel } from '../utils/Field'
import Link from '../utils/Link'

// import schema from '../../types/graphql'
const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
})

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

// export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ arresteeArrests, queryResult: { refetch } }) => {
  const [display_fields, setDisplayFields] = useState([
    'display_name',
    'date',
    'custom_fields.custody_status',
    'custom_fields.disposition',
    'custom_fields.release_type',
  ])

  const extraCols = Object.keys(schema).map((field) => {
    const fieldDef = schema[field]
    const type = fieldDef.type
    const col = {
      accessorKey: field,
      header: formatLabel(field),
    }
    if (type === 'date-time' || type === 'date') {
      col.accessorFn = (originalRow) => {
        const val = _.get(originalRow, field)
        return val ? dayjs(val).startOf('day') : null
      }
      col.Cell = ({ cell }) => cell.getValue() && cell.getValue().format('L')
      col.filterVariant = 'date'
    } else if (type === 'checkbox') {
      col.id = field
      col.accessorFn = (originalRow) =>
        _.get(originalRow, field) ? 'true' : 'false'
      col.Cell = ({ cell }) => (cell.getValue() === 'true' ? 'Yes' : 'No')
      col.filterVariant = 'checkbox'
    } else if (type === 'select') {
      col.filterVariant = 'multi-select'
      col.filterSelectOptions = fieldDef.props.options
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
          <Link color="secondary" to={routes.arrest({ id: row.original.id })}>
            {cell.getValue()}
          </Link>
        ),
      },
      ...extraCols,
    ],
    []
  )
  const handleExportRows = (data) => {
    const columns = table.getAllColumns().filter((c) => c.getIsVisible())
    const rows = data.map((item) => {
      return columns.reduce((acc, { columnDef }) => {
        const value = _.get(item.original, columnDef.id)
        acc[columnDef.header] = value
        return acc
      }, {})
    })
    const csv = generateCsv(csvConfig)(rows)
    download(csvConfig)(csv)
  }

  const data = arresteeArrests
  const columnVisibility = Object.keys(schema).reduce((acc, f) => {
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
    enableStickyHeader: true,
    muiPaginationProps: {
      // rowsPerPageOptions: [50, 100, 500],
    },
    enableColumnFilterModes: true,
    muiTableContainerProps: { sx: { maxHeight: 'calc(100vh - 320px)' } },
    enableColumnPinning: true,
    initialState: {
      columnVisibility,
      density: 'compact',
      showGlobalFilter: true,
      enableDensityToggle: false,
      sorting: [{ id: 'date', desc: false }],
      pagination: { pageSize: 50, pageIndex: 0 },
      columnPinning: { left: ['arrestee.display_field'] },
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          //export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
          startIcon={<FileDownload />}
        >
          Save as Spreadsheet
        </Button>
      </Box>
    ),
  })

  // const doFilter = () => {
  //   refetch({
  //     filters: [
  //       {
  //         field: 'custom_fields.arresting_officer',
  //         value: 'bad',
  //         operator: 'string_contains',
  //       },
  //       {
  //         field: 'arrestee.first_name',
  //         value: 'greg',
  //         operator: 'contains',
  //       },
  //     ],
  //   })
  // }

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  )
}
