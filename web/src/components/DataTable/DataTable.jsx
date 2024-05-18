import { useEffect, useMemo, useState } from 'react'

import { Delete, EditNote, FileDownload, Refresh } from '@mui/icons-material'
import { Box, Button, IconButton, Stack, Tooltip } from '@mui/material'
import { download, generateCsv, mkConfig } from 'export-to-csv'
import { get, merge, sortBy } from 'lodash'
import { difference } from 'lodash'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'

import dayjs from '../../../../api/src/lib/day'
import { formatLabel } from '../utils/Field'

import ManageViews from './ManageViews'

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
  bulkDelete,
  manageViews = false,
  type = '',
}) => {
  const initialState = merge(
    {
      columnVisibility: Object.keys(schema).reduce((acc, f) => {
        acc[f] = displayColumns.includes(f)
        return acc
      }, {}),
      density: 'compact',
      enableDensityToggle: false,
      columnFilters: [],
      columnOrder: [{ id: 'date', desc: true }],
      sorting: [],
      globalFilter: '',
    },
    tableProps.initialState
  )
  delete tableProps.initialState

  const [localState, setLocalState] = useState({})
  const [stateLoaded, setStateLoaded] = useState(false)

  useEffect(() => {
    const sessionState = merge(
      initialState,
      type ? JSON.parse(sessionStorage.getItem(`${type}_table_state`)) : {}
    )
    loadState(sessionState)
  }, [type])

  const getDefault = (key) => localState[key] || initialState[key]

  const [columnFilters, setColumnFilters] = useState(
    getDefault('columnFilters')
  )
  const [columnVisibility, setColumnVisibility] = useState(
    getDefault('columnVisibility')
  )
  const [globalFilter, setGlobalFilter] = useState(getDefault('globalFilter '))
  const [sorting, setSorting] = useState(getDefault('sorting'))
  const [columnOrder, setColumnOrder] = useState(getDefault('columnOrder'))

  const loadState = (state) => {
    setColumnFilters(state.columnFilters)
    setGlobalFilter(state.globalFilter)
    setColumnOrder(state.columnOrder)
    setColumnVisibility(state.columnVisibility)
    setSorting(state.sorting)
    setLocalState(state)
    setStateLoaded(true)
  }

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

  const state = {
    columnFilters,
    columnVisibility,
    globalFilter,
    sorting,
    columnOrder,
  }

  useEffect(() => {
    if (stateLoaded) {
      sessionStorage.setItem(
        'table_state',
        JSON.stringify({
          columnFilters,
          columnVisibility,
          globalFilter,
          sorting,
          columnOrder,
        })
      )
    }
  }, [
    columnFilters,
    columnVisibility,
    globalFilter,
    sorting,
    columnOrder,
    stateLoaded,
  ])

  const defaultProps = {
    columns,
    data,
    enableDensityToggle: false,
    enableStickyHeader: true,
    getRowId: (originalRow) => originalRow.id,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,

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
            <span>
              <IconButton
                disabled={table.getPrePaginationRowModel().rows.length === 0}
                onClick={() =>
                  //export all rows, including from the next page, (still respects filtering and sorting)
                  handleExportRows(table.getPrePaginationRowModel().rows)
                }
              >
                <FileDownload />
              </IconButton>
            </span>
          </Tooltip>
        )}
        {manageViews && (
          <ManageViews
            tableState={state}
            setTableState={loadState}
            defaultState={initialState}
          />
        )}
        {actionButtons && actionButtons(table)}
      </Box>
    ),
  }

  if (bulkUpdate || bulkDelete) {
    const buttons = []
    if (bulkDelete) {
      buttons.push(
        <Button
          key="delete"
          variant="contained"
          color="secondary"
          startIcon={<Delete />}
          onClick={() => bulkDelete(table)}
        >
          Delete Selected Arrests
        </Button>
      )
    }
    if (bulkUpdate) {
      buttons.push(
        <Button
          key="update"
          variant="contained"
          color="secondary"
          startIcon={<EditNote />}
          onClick={() => bulkUpdate(table)}
        >
          Update Selected Arrests
        </Button>
      )
    }
    defaultProps.muiToolbarAlertBannerProps = {
      children: (
        <Stack
          sx={{ position: 'absolute', right: 16, bottom: 8 }}
          spacing={2}
          direction={'row'}
        >
          {buttons}
        </Stack>
      ),
    }
  }

  if (globalFilter) {
    state.showGlobalFilter = true
  }
  if (state.columnFilters.length) {
    state.showColumnFilters = true
  }

  const properties = merge(defaultProps, tableProps)
  properties.data = stateLoaded ? data : []
  properties.state = state

  const table = useMaterialReactTable(properties)
  // const currentTableState = table.getState()
  // console.log('live', currentTableState.sorting[0])

  return <MaterialReactTable table={table} />
}

export default DataTable
