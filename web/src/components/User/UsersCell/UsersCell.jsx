import { useState } from 'react'

import { routes } from '@redwoodjs/router'

import DataTable from 'src/components/DataTable/DataTable'
import BulkUpdateModal from 'src/components/utils/BulkUpdateModal'
import Link from 'src/components/utils/Link'
import { userSchema } from 'src/lib/FieldSchemas'

export const QUERY = gql`
  query UsersQuery {
    users {
      id
      name
      email
      role
      access_date_max
      access_date_min
      expiresAt
      actions {
        name
      }
    }
  }
`

const BULK_UPDATE_USERS = gql`
  mutation BulkUpdateUsers($ids: [Int]!, $input: UpdateUserInput!) {
    bulkUpdateUsers(ids: $ids, input: $input) {
      count
    }
  }
`

export const Success = ({ users, queryResult: { refetch } }) => {
  const [bulkUpdateRows, setBulkUpdateRows] = useState(null)

  const displayColumns = ['email', 'role', 'expiresAt', 'actions']

  const tableProps = {
    enableColumnFilterModes: true,
    enableColumnPinning: true,
    enableRowSelection: true,
    enableColumnOrdering: true,
    selectAllMode: 'all',
    initialState: {
      showGlobalFilter: true,
      columnPinning: {
        left: ['mrt-row-select', 'name'],
      },
    },
  }

  const bulkUpdate = (table) => {
    setBulkUpdateRows(table.getSelectedRowModel().rows)
  }

  const preColumns = [
    {
      accessorKey: 'name',
      header: 'Name',
      columnVisibility: true,
      Cell: ({ row, renderedCellValue }) => (
        <Link color="secondary" to={routes.user({ id: row.original.id })}>
          {renderedCellValue}
        </Link>
      ),
    },
  ]

  const actions = Array.from(
    new Set(
      users.map((user) => user.actions.map((action) => action.name)).flat()
    )
  )
  const customFields = {
    actions: {
      type: 'array',
      label: 'Actions',
      filterSelectOptions: actions,
    },
  }

  return (
    <>
      <DataTable
        data={users.map((user) => ({
          ...user,
          actions: user.actions.map((action) => action.name),
        }))}
        displayColumns={displayColumns}
        tableProps={tableProps}
        refetch={refetch}
        bulkUpdate={bulkUpdate}
        schema={userSchema}
        preColumns={preColumns}
        customFields={customFields}
        // manageViews
        type="users"
        name="user"
      />
      <BulkUpdateModal
        bulkUpdateRows={bulkUpdateRows}
        setBulkUpdateRows={setBulkUpdateRows}
        mutation={BULK_UPDATE_USERS}
        schema={userSchema}
        name="user"
        onSuccess={refetch}
      />
    </>
  )
}
