import { useState } from 'react'

import { Grid2, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useConfirm } from 'material-ui-confirm'

import { routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import { schema } from 'src/lib/FieldSchemas'

import DataTable from '../DataTable/DataTable'
import BulkUpdateModal from '../utils/BulkUpdateModal'
import Link from '../utils/Link'
import { useDisplayError, useSnackbar } from '../utils/SnackBar'

// import schema from '../../types/graphql'

export const QUERY = gql`
  query ArrestsQuery($filters: [GenericFilterInput]) {
    arrests: filterArrests(filters: $filters) {
      id
      date
      location
      arrest_city
      charges
      citation_number
      jurisdiction
      custom_fields
      arrestee {
        id
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
      action {
        id
        name
        start_date
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
const BULK_DELETE_ARRESTS = gql`
  mutation BulkDeleteArrests($ids: [Int]!) {
    bulkDeleteArrests(ids: $ids) {
      count
    }
  }
`

const BULK_UPDATE_ARRESTS = gql`
  mutation BulkUpdateArrests($ids: [Int]!, $input: UpdateArrestInput!) {
    bulkUpdateArrests(ids: $ids, input: $input) {
      count
    }
  }
`

export const Loading = () => (
  <div>
    <DataTable
      data={[]}
      schema={schema}
      displayColumns={displayColumns}
      tableProps={tableProps}
      preColumns={preColumns}
      manageViews
      type="arrestees"
      name="arrest"
      loading
    />
  </div>
)

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ arrests, queryResult: { refetch } = {} }) => {
  const [bulkUpdateRows, setBulkUpdateRows] = useState(null)
  const { openSnackbar } = useSnackbar()

  const displayError = useDisplayError()

  const confirm = useConfirm()
  const [bulkDeleteArrests] = useMutation(BULK_DELETE_ARRESTS, {
    onCompleted: () => {
      refetch()
    },
  })

  const data = arrests

  const bulkUpdate = (table) => {
    setBulkUpdateRows(table.getSelectedRowModel().rows)
  }

  const bulkDelete = async (table) => {
    const { rows } = table.getSelectedRowModel()
    const ids = rows.map(({ id }) => id)
    const list = rows.map((row) => {
      return [
        <Grid2 key={`${row.id}-name`} size={8}>
          {`${row.original?.arrestee?.display_field}`}
        </Grid2>,
        <Grid2 key={`${row.id}-date`} size={4}>
          {`${dayjs(row.original?.date).format('L hh:mm A')}`}
        </Grid2>,
      ]
    })
    await confirm({
      content: (
        <>
          Are you sure you want to delete the following arrests?
          <Grid2 container spacing={2} sx={{ mt: 2 }}>
            <Grid2 key={'name'} size={8}>
              <b>Name</b>
            </Grid2>
            <Grid2 key={'date'} size={4}>
              <b>Arrest Date</b>
            </Grid2>

            {list.flat()}
          </Grid2>
        </>
      ),
    })
    try {
      const {
        data: {
          bulkDeleteArrests: { count },
        },
      } = await bulkDeleteArrests({ variables: { ids } })
      openSnackbar(`${count} arrest records deleted`)
      // closeModal()
      table.resetRowSelection()
      refetch()
    } catch (error) {
      displayError(error)
    }
  }

  return (
    <>
      <Stack spacing={0} direction="column">
        <DataTable
          data={data}
          schema={schema}
          displayColumns={displayColumns}
          tableProps={tableProps}
          refetch={refetch}
          preColumns={preColumns}
          bulkUpdate={bulkUpdate}
          bulkDelete={bulkDelete}
          manageViews
          type="arrestees"
          name="arrest"
          persistState
          footerNotes={
            <Stack spacing={0} direction="column">
              <Typography variant="caption">
                If a preferred name is provided, the legal first name appears in
                parentheses.
              </Typography>
              <Typography variant="caption">
                * indicates the displayed name is the preferred name, and the
                legal name is confidential.
              </Typography>
            </Stack>
          }
        />
      </Stack>
      <BulkUpdateModal
        bulkUpdateRows={bulkUpdateRows}
        setBulkUpdateRows={setBulkUpdateRows}
        mutation={BULK_UPDATE_ARRESTS}
        schema={schema}
        name="arrest"
        onSuccess={() => {
          refetch()
        }}
      />
    </>
  )
}

const tableProps = {
  enableColumnFilterModes: true,
  // muiTableContainerProps: { sx: { maxHeight: 'calc(100vh - 283px)' } },
  enableColumnPinning: true,
  enableRowSelection: true,
  enableColumnOrdering: true,
  selectAllMode: 'all',

  initialState: {
    showGlobalFilter: true,
    sorting: [{ id: 'date', desc: true }],
    columnPinning: {
      left: ['mrt-row-select', 'arrestee.display_field'],
    },
  },
}

const displayColumns = [
  'date',
  'custom_fields.custody_status',
  'custom_fields.disposition',
  'custom_fields.release_type',
]

const preColumns = [
  {
    accessorKey: 'arrestee.display_field',
    id: 'arrestee.display_field',
    header: 'Name',
    Cell: ({ row, renderedCellValue }) => (
      <Link color="secondary" to={routes.arrest({ id: row.original.id })}>
        {renderedCellValue}
      </Link>
    ),
  },
]
