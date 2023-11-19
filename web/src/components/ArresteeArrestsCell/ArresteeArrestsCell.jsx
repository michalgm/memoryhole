import { useState } from 'react'

import { routes } from '@redwoodjs/router'

import { schema } from 'src/lib/ArrestFields'

import DataTable from '../DataTable/DataTable'
import Link from '../utils/Link'

// import schema from '../../types/graphql'

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

export const Loading = () => <div>Loading...</div>

// export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ arresteeArrests, queryResult: { refetch } }) => {
  const [displayColumns] = useState([
    'date',
    'custom_fields.custody_status',
    'custom_fields.disposition',
    'custom_fields.release_type',
  ])

  const preColumns = [
    {
      accessorKey: 'arrestee.display_field',
      header: 'Name',
      Cell: ({ cell, row }) => (
        <Link color="secondary" to={routes.arrest({ id: row.original.id })}>
          {cell.getValue()}
        </Link>
      ),
    },
  ]

  const data = arresteeArrests

  const tableProps = {
    enableColumnFilterModes: true,
    muiTableContainerProps: { sx: { maxHeight: 'calc(100vh - 320px)' } },
    enableColumnPinning: true,
    initialState: {
      showGlobalFilter: true,
      sorting: [{ id: 'date', desc: false }],
      pagination: { pageSize: 50, pageIndex: 0 },
      columnPinning: { left: ['arrestee.display_field'] },
    },
  }

  return (
    <DataTable
      data={data}
      schema={schema}
      displayColumns={displayColumns}
      // columns={columns}
      tableProps={tableProps}
      refetch={refetch}
      preColumns={preColumns}
    />
  )
}
