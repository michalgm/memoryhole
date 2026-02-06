import { routes } from '@cedarjs/router'
import { useQuery } from '@cedarjs/web'

import DataTable from 'src/components/DataTable/DataTable'
import Link from 'src/components/utils/Link'
import { useDisplayError } from 'src/components/utils/SnackBar'
import { actionSchema } from 'src/lib/FieldSchemas'

export const QUERY = gql`
  query ActionsQuery {
    actions {
      ...ActionFields
    }
  }
`

const ActionsPage = () => {
  const displayError = useDisplayError()

  const { data, refetch } = useQuery(QUERY, {
    onError: displayError,
  })

  const displayColumns = [
    'start_date',
    'end_date',
    'city',
    'jurisdiction',
    'location',
  ]

  const tableProps = {
    enableColumnFilterModes: true,
    initialState: {
      showGlobalFilter: true,
      columnPinning: {
        left: ['mrt-row-select', 'name'],
      },
      sorting: [{ id: 'start_date', desc: true }],
    },
  }

  const extendedSchema = {
    ...actionSchema,
    arrests_count: { type: 'number', props: {} },
    logs_count: { type: 'number', props: {} },
  }

  const preColumns = [
    {
      accessorKey: 'name',
      header: 'Name',
      columnVisibility: true,
      Cell: ({ row, renderedCellValue }) => (
        <Link color="secondary" to={routes.action({ id: row.original.id })}>
          {renderedCellValue}
        </Link>
      ),
    },
  ]

  return (
    <DataTable
      data={data?.actions || []}
      displayColumns={displayColumns}
      tableProps={tableProps}
      refetch={refetch}
      schema={extendedSchema}
      preColumns={preColumns}
      type="actions"
      name="action"
    />
  )
}

export default ActionsPage
