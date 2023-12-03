import { useMemo } from 'react'

import { EditNote, FileDownload, Refresh } from '@mui/icons-material'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import { download, generateCsv, mkConfig } from 'export-to-csv' //or use your library of choice here
import { get, merge, sortBy } from 'lodash'
import { difference } from 'lodash'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'

import dayjs from '../../../../api/src/lib/day'
import { formatLabel } from '../utils/Field'

const csvConfig = mkConfig({
  useKeysAsHeaders: true,
})

export const defineColumns = (schema, displayColumns) => {
  const columnNames = sortBy(
    difference(Object.keys(schema), displayColumns),
    (k) => schema[k].props.label || formatLabel(k)
  )

  const columns = [...displayColumns, ...columnNames].map((field) => {
    const fieldDef = schema[field]
    const type = fieldDef.type

    const col = {
      accessorKey: field,
      header: fieldDef.props?.label || formatLabel(field),
      fieldType: type,
      enablePinning: false,
    }
    if (type === 'date-time' || type === 'date') {
      const format = type === 'date' ? 'L' : 'L hh:mm A'
      col.accessorFn = (originalRow) => {
        const val = get(originalRow, field)
        if (type == 'date') {
          return val ? dayjs(val).startOf('day') : null
        } else {
          return val ? dayjs(val) : null
        }
      }
      col.Cell = ({ cell }) => cell.getValue() && cell.getValue().format(format)
      col.filterVariant = 'date'
    } else if (type === 'checkbox') {
      col.id = field
      col.accessorFn = (originalRow) =>
        get(originalRow, field) ? 'true' : 'false'
      col.Cell = ({ cell }) => (cell.getValue() === 'true' ? 'Yes' : 'No')
      col.filterVariant = 'checkbox'
    } else if (type === 'select') {
      col.filterVariant = 'multi-select'
      col.filterSelectOptions = fieldDef.props.options
    }
    return col
  })
  return columns
}

const DataTable = ({
  data,
  schema,
  displayColumns = [],
  tableProps,
  refetch,
  disableDownload,
  preColumns = [],
  postColumns = [],
  actionButtons,
  bulkUpdate,
}) => {
  const handleExportRows = (data) => {
    const columns = table.getAllColumns().filter((c) => c.getIsVisible())
    const rows = data.map((row) => {
      return columns.reduce(
        (acc, { columnDef: { id, header, Cell, filterVariant } }, index) => {
          if (id.match(/^mrt/)) {
            return acc
          }
          const cell = row.getVisibleCells()[index]
          const value =
            filterVariant === 'date' ? Cell({ cell }) : cell.getValue()
          acc[header] = value === null ? '' : value
          return acc
        },
        {}
      )
    })
    const csv = generateCsv(csvConfig)(rows)
    download(csvConfig)(csv)
  }
  const columns = useMemo(
    () => [
      ...preColumns,
      ...defineColumns(schema, displayColumns),
      ...postColumns,
    ],
    [preColumns, postColumns, displayColumns, schema]
  )

  const columnVisibility = Object.keys(schema).reduce((acc, f) => {
    acc[f] = displayColumns.includes(f)
    return acc
  }, {})

  const defaultProps = {
    columns,
    data,
    enableDensityToggle: false,
    enableStickyHeader: true,
    initialState: {
      columnVisibility,
      density: 'compact',
      enableDensityToggle: false,
    },
    getRowId: (originalRow) => originalRow.id,
    muiTableBodyProps: {
      sx: {
        backgroundColor: '#fff',
        '& tr:nth-of-type(odd) > td': {
          backgroundColor: '#f5f5f5',
        },
      },
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {refetch && (
          <Tooltip title="Refresh Data">
            <IconButton onClick={() => refetch()}>
              <Refresh />
            </IconButton>
          </Tooltip>
        )}
        {!disableDownload && (
          <Tooltip title="Save as spreadsheet (CSV)">
            <IconButton
              disabled={table.getPrePaginationRowModel().rows.length === 0}
              onClick={() =>
                //export all rows, including from the next page, (still respects filtering and sorting)
                handleExportRows(table.getPrePaginationRowModel().rows)
              }
            >
              <FileDownload />
            </IconButton>
          </Tooltip>
        )}
        {actionButtons && actionButtons(table)}
      </Box>
    ),
  }

  if (bulkUpdate) {
    defaultProps.muiToolbarAlertBannerProps = {
      children: (
        <Box sx={{ position: 'absolute', right: 16, bottom: 8 }}>
          <Tooltip title="Bulk Update">
            <Button
              variant="contained"
              color="secondary"
              startIcon={<EditNote />}
              onClick={() => bulkUpdate(table)}
            >
              Bulk Update
            </Button>
          </Tooltip>
        </Box>
      ),
    }
  }

  const table = useMaterialReactTable({
    ...merge(defaultProps, tableProps),
  })
  return <MaterialReactTable table={table} />
}

export default DataTable
