import { useMemo } from 'react'

import { FileDownload, Refresh } from '@mui/icons-material'
import { Box, IconButton, Tooltip } from '@mui/material'
import { download, generateCsv, mkConfig } from 'export-to-csv' //or use your library of choice here
import { get, merge } from 'lodash'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'

import dayjs from '../../../../api/src/lib/day'
import { formatLabel } from '../utils/Field'

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
})

export const defineColumns = (schema) => {
  const columnNames = Object.keys(schema)
  const columns = columnNames.map((field) => {
    const fieldDef = schema[field]
    const type = fieldDef.type

    const col = {
      accessorKey: field,
      header: formatLabel(fieldDef.props?.label || field),
    }
    if (type === 'date-time' || type === 'date') {
      const format = type === 'date' ? 'L' : 'L hh:MM A'
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
}) => {
  const handleExportRows = (data) => {
    const columns = table.getAllColumns().filter((c) => c.getIsVisible())
    const rows = data.map((item) => {
      return columns.reduce((acc, { columnDef }) => {
        const value = get(item.original, columnDef.id)
        acc[columnDef.header] = value
        return acc
      }, {})
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
    muiTableBodyProps: {
      sx: {
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
          <Tooltip title="Save as spreadshtee (CSV)">
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
      </Box>
    ),
  }
  const table = useMaterialReactTable({
    ...merge(defaultProps, tableProps),
  })
  return <MaterialReactTable table={table} />
}

export default DataTable
