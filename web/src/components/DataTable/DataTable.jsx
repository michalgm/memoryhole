import { useCallback, useEffect, useState, useRef } from 'react'

import { Delete, EditNote, FileDownload, Refresh } from '@mui/icons-material'
import { Box, Button, Chip, IconButton, Stack, Tooltip } from '@mui/material'
import { download, generateCsv, mkConfig } from 'export-to-csv'
import { get, merge, sortBy, difference } from 'lodash-es'
import {
  MaterialReactTable,
  useMaterialReactTable,
  getDefaultColumnFilterFn,
} from 'material-react-table'
import pluralize from 'pluralize'

import dayjs from '../../../../api/src/lib/day'
import { formatLabel } from '../utils/BaseField'

import ManageViews from './ManageViews'

const csvConfig = mkConfig({
  useKeysAsHeaders: true,
})

export const defineColumns = (
  schema,
  displayColumns,
  visibleColumns,
  customFields = {}
) => {
  const mergedSchema = { ...schema, ...customFields }
  const columnNames = sortBy(
    difference(Object.keys(mergedSchema), [
      ...displayColumns,
      ...visibleColumns,
    ]),
    (k) => mergedSchema[k]?.props.label || formatLabel(k)
  )

  const columns = [...displayColumns, ...columnNames].map((field) => {
    const fieldDef = mergedSchema[field]
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
          return val ? dayjs(val).startOf('day').toDate() : null
        } else {
          return val ? dayjs(val).toDate() : null
        }
      }
      col.Cell = ({ cell }) =>
        cell.getValue() ? dayjs(cell.getValue()).format(format) : null
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
    } else if (type === 'action_chooser') {
      col.accessorFn = (originalRow) => {
        return get(originalRow, field)?.name
      }
    } else if (type === 'array') {
      col.accessorFn = (originalRow) => {
        const val = get(originalRow, field)
        if (!val || val.length == 0) return null
        return val.join('|')
      }
      col.Cell = ({ row }) => {
        const val = row.original[field]
        if (val && val.length > 0) {
          return (
            <Stack direction="row" spacing={1}>
              {val.map((item) => (
                <Chip size="small" key={item} label={item} />
              ))}
            </Stack>
          )
        }
      }
    }
    return col
  })
  return columns
}

const useTableState = (initialState, type, persistState) => {
  const [localState, setLocalState] = useState({})
  const [stateLoaded, setStateLoaded] = useState(false)

  useEffect(() => {
    const storedState = type
      ? JSON.parse(sessionStorage.getItem(`${type}_table_state`))
      : null
    const mergedState = merge(initialState, storedState)
    setLocalState(mergedState)
    setStateLoaded(true)
  }, [type, initialState])

  const saveState = useCallback(
    (state) => {
      if (persistState && type) {
        sessionStorage.setItem(`${type}_table_state`, JSON.stringify(state))
      }
    },
    [persistState, type]
  )

  return { localState, stateLoaded, setLocalState, saveState }
}

const ToolbarActions = ({
  table,
  reload,
  disableDownload,
  manageViews,
  state,
  loadState,
  initialState,
  actionButtons,
  columnOrder,
}) => {
  const handleExportRows = (data) => {
    const columns = table
      .getVisibleFlatColumns()
      .sort((a, b) => columnOrder.indexOf(a.id) - columnOrder.indexOf(b.id))

    const rows = data.map((row) => {
      return columns.reduce(
        (acc, { columnDef: { id, header, Cell, filterVariant } }, index) => {
          if (id.match(/^mrt/)) {
            return acc
          }
          const cell = row.getVisibleCells()[index]
          let value =
            filterVariant === 'date' ? Cell({ cell }) : cell.getValue()
          if (typeof value === 'object') {
            if (value !== null) {
              console.error(`Unknown value for ${header}`, value)
            }
            value = ''
          }
          acc[header] = value === null ? '' : value
          return acc
        },
        {}
      )
    })
    const csv = generateCsv(csvConfig)(rows)
    download(csvConfig)(csv)
  }
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      {reload && (
        <Tooltip title="Refresh Data">
          <IconButton onClick={() => reload()}>
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
  )
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
  name = '',
  persistState = false,
  customFields = {},
  loading = false,
}) => {
  const [reloading, setReloading] = useState(false)

  const visibleColumns = [
    ...displayColumns,
    ...[...preColumns, ...postColumns].map((c) => c.accessorKey),
  ]

  const reload = async () => {
    setReloading(true)
    await refetch()
    setReloading(false)
  }

  const columns = [
    ...preColumns,
    ...defineColumns(schema, displayColumns, visibleColumns, customFields),
    ...postColumns,
  ]
  const columnsRef = useRef(columns)
  const initialStateRef = useRef(
    merge(
      {
        columnVisibility: Object.keys(schema).reduce((acc, f) => {
          acc[f] = visibleColumns.includes(f)
          return acc
        }, {}),
        density: 'compact',
        enableDensityToggle: false,
        columnFilters: [],
        columnOrder: [],
        sorting: [],
        globalFilter: '',
        pagination: { pageSize: 50, pageIndex: 0 },
        columnFilterFns: columns.reduce((acc, column) => {
          acc[column.accessorKey] = getDefaultColumnFilterFn(column)
          return acc
        }, {}),
      },
      tableProps.initialState
    )
  )
  const initialState = initialStateRef.current
  const { localState, stateLoaded, setLocalState, saveState } = useTableState(
    initialState,
    type,
    persistState
  )

  const loadState = (state) => {
    state.columnFilters = (state.columnFilters || []).reduce(
      (acc, { id, value }) => {
        const colDef = columnsRef.current.find((c) => c.id === id)
        if (colDef?.fieldType === 'date' || colDef?.fieldType === 'date-time') {
          value = dayjs(value)
        }
        acc.push({ id, value })
        return acc
      },
      []
    )
    setColumnFilters(state.columnFilters)
    setGlobalFilter(state.globalFilter)
    setColumnOrder(state.columnOrder)
    setColumnVisibility(state.columnVisibility)
    if (state.pagination) {
      setPagination(state.pagination)
    }
    setSorting(state.sorting)
    setColumnFilterFns(state.columnFilterFns)
    setLocalState(state)
  }

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
  const [pagination, setPagination] = useState(getDefault('pagination'))
  const [columnFilterFns, setColumnFilterFns] = useState(
    getDefault('columnFilterFns')
  )

  const state = {
    columnFilters,
    columnVisibility,
    globalFilter,
    sorting,
    columnOrder,
    pagination,
    columnFilterFns,
    showGlobalFilter: globalFilter,
    showColumnFilters: columnFilters.length > 0,
    showProgressBars: reloading,
    isLoading: loading,
  }

  useEffect(() => {
    saveState({
      columnFilters,
      columnVisibility,
      globalFilter,
      sorting,
      columnOrder,
      pagination,
      columnFilterFns,
    })
  }, [
    saveState,
    columnFilters,
    columnVisibility,
    globalFilter,
    sorting,
    columnOrder,
    stateLoaded,
    pagination,
    columnFilterFns,
  ])

  const defaultProps = {
    columns: columnsRef.current,
    data,
    enableDensityToggle: false,
    enableStickyHeader: true,
    getRowId: (originalRow) => originalRow.id,
    onColumnFiltersChange: setColumnFilters,
    onColumnFilterFnsChange: setColumnFilterFns,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    muiTableBodyProps: {
      sx: {
        backgroundColor: '#fff',
        '& tr:nth-of-type(odd) > td, & tr:nth-of-type(odd) > td[data-pinned="true"]:before':
          {
            backgroundColor: '#f5f5f5',
          },
      },
    },
    muiSearchTextFieldProps: {
      placeholder: 'Search All Fields',
    },
    muiSkeletonProps: {
      animation: 'wave',
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <ToolbarActions
        table={table}
        reload={refetch && reload}
        disableDownload={disableDownload}
        manageViews={manageViews}
        state={state}
        loadState={loadState}
        initialState={initialState}
        actionButtons={actionButtons}
        columnOrder={columnOrder}
      />
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
          Delete Selected {pluralize(name)}
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
          Update Selected {pluralize(name)}
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

  const properties = merge(defaultProps, tableProps)
  properties.data = stateLoaded ? data : []
  properties.state = state
  delete properties.state.initialState

  const table = useMaterialReactTable(properties)
  return <MaterialReactTable table={table} />
}

export default DataTable
