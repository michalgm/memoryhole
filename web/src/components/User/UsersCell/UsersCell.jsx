import { useState } from 'react'

import { routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import DataTable from 'src/components/DataTable/DataTable'
import BulkUpdateModal from 'src/components/utils/BulkUpdateModal'
import Link from 'src/components/utils/Link'
import { useSnackbar } from 'src/components/utils/SnackBar'
import { UserFields, userSchema } from 'src/lib/FieldSchemas'

export const QUERY = gql`
  query UsersQuery {
    users {
      id
      name
      email
      role
      arrest_date_max
      arrest_date_min
      expiresAt
      action_ids
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
  const { openSnackbar } = useSnackbar()

  const [displayColumns] = useState(['email', 'role', 'expiresAt'])

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
      Cell: ({ row, renderedCellValue }) => (
        <Link color="secondary" to={routes.user({ id: row.original.id })}>
          {renderedCellValue}
        </Link>
      ),
    },
  ]

  return (
    <>
      <DataTable
        data={users}
        displayColumns={displayColumns}
        tableProps={tableProps}
        refetch={refetch}
        bulkUpdate={bulkUpdate}
        schema={userSchema}
        preColumns={preColumns}
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
