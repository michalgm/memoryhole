import { useState } from 'react'

import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import dayjs from 'dayjs'
import { useConfirm } from 'material-ui-confirm'

import { routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { schema } from 'src/lib/FieldSchemas'

import DataTable from '../DataTable/DataTable'
import BulkUpdateModal from '../utils/BulkUpdateModal'
import Link from '../utils/Link'
import { useDisplayError, useSnackbar } from '../utils/SnackBar'

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
      // refetch={refetch}
      preColumns={preColumns}
      // bulkUpdate={bulkUpdate}
      // bulkDelete={bulkDelete}
      manageViews
      type="arrestees"
      name="arrest"
      // persistState
      loading
    />
  </div>
)

// export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ arresteeArrests, queryResult: { refetch } }) => {
  const [bulkUpdateRows, setBulkUpdateRows] = useState(null)
  const { openSnackbar } = useSnackbar()

  const displayError = useDisplayError()

  const confirm = useConfirm()
  const [bulkDeleteArrests] = useMutation(BULK_DELETE_ARRESTS, {
    onCompleted: () => {
      toast.success('Arrests Delete')
      refetch()
    },
  })

  const data = arresteeArrests

  const bulkUpdate = (table) => {
    setBulkUpdateRows(table.getSelectedRowModel().rows)
  }

  const bulkDelete = async (table) => {
    const { rows } = table.getSelectedRowModel()
    const ids = rows.map(({ id }) => id)
    const list = rows.map((row) => {
      return [
        <Grid2 key={`${row.id}-name`} xs={8}>
          {`${row.original.arrestee.display_field}`}
        </Grid2>,
        <Grid2 key={`${row.id}-date`} xs={4}>
          {`${dayjs(row.original.date).format('L hh:mm A')}`}
        </Grid2>,
      ]
    })
    await confirm({
      content: (
        <>
          Are you sure you want to delete the following arrests?
          <Grid2 container spacing={2} sx={{ mt: 2 }}>
            <Grid2 key={'name'} xs={8}>
              <b>Name</b>
            </Grid2>
            <Grid2 key={'date'} xs={4}>
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
      />
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
  muiTableContainerProps: { sx: { maxHeight: 'calc(100vh - 320px)' } },
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
    header: 'Name',
    Cell: ({ row, renderedCellValue }) => (
      <Link color="secondary" to={routes.arrest({ id: row.original.id })}>
        {renderedCellValue}
      </Link>
    ),
  },
]
