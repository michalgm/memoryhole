import { useCallback, useEffect, useRef, useState } from 'react'

import { Delete, EditNote, FileDownload, Refresh } from '@mui/icons-material'
import { Button, Chip, IconButton, Stack, Tooltip } from '@mui/material'
import { download, generateCsv, mkConfig } from 'export-to-csv'
import { difference, get, isArray, merge, sortBy } from 'lodash-es'
import {
  flexRender,
  getDefaultColumnFilterFn,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table'
import pluralize from 'pluralize'
import { flushSync } from 'react-dom'
import ReactDOM from 'react-dom/client'

import { useContainerWidth } from 'src/lib/AppContext'
import dayjs from 'src/lib/dayjs'

import { formatLabel } from '../utils/BaseField'

import ManageViews from './ManageViews'

const csvConfig = mkConfig({
  useKeysAsHeaders: true,
  prependHeader: true,
  useBom: true,
})

const extractTextFromJSXRender = (JSX) => {
  const tempDiv = document.createElement('div')
  tempDiv.style.position = 'absolute'
  tempDiv.style.top = '-9999px'
  tempDiv.style.left = '-9999px'
  tempDiv.style.height = '0'
  tempDiv.style.overflow = 'hidden'

  document.body.appendChild(tempDiv)
  const root = ReactDOM.createRoot(tempDiv)
  flushSync(() => root.render(JSX))
  const text = tempDiv.textContent.trim()
  root.unmount()
  document.body.removeChild(tempDiv)
  return text
}

const defineColumns = (
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
    const type = fieldDef?.type || 'text'
    const label = fieldDef?.props?.label || formatLabel(field)
    if (!fieldDef) {
      console.warn(`Field definition not found for ${field}`)
    }
    const col = {
      accessorKey: field,
      header: label,
      fieldType: type,
      enablePinning: false,
      size: 1,
      minSize: 1,
    }
    if (type === 'date-time' || type === 'date') {
      col.accessorFn = (originalRow) => {
        const val = get(originalRow, field) ?? null
        return val ? dayjs(val).toDate() : null
      }
      col.Cell = ({ cell }) =>
        cell.getValue()
          ? type == 'date'
            ? dayjs.utc(cell.getValue()).format('L')
            : dayjs.tz(cell.getValue()).format('L hh:mm A')
          : null
      col.filterVariant = 'date'
    } else if (type === 'checkbox') {
      col.id = field
      col.accessorFn = (originalRow) => !!get(originalRow, field)
      col.Cell = ({ cell }) => (cell.getValue() ? 'Yes' : 'No')
      col.filterVariant = 'checkbox'
    } else if (type === 'textarea') {
      col.Cell = ({ cell }) => (
        <div
          style={{
            whiteSpace: 'pre-wrap',
            maxHeight: '200px',
            overflow: 'auto',
          }}
        >
          {cell.getValue()}
        </div>
      )
    } else if (type === 'select') {
      col.filterVariant = 'multi-select'
      col.filterSelectOptions = fieldDef?.options || []
      col.filterSelectOptions = fieldDef.props.options
    } else if (type === 'action_chooser') {
      col.accessorFn = (originalRow) => {
        return get(originalRow, field)?.name ?? null
      }
    } else if (type === 'array') {
      col.filterVariant = 'multi-select'
      col.filterSelectOptions =
        fieldDef?.props?.options || fieldDef?.filterSelectOptions || []
      col.filterFn = 'arrIncludesSome'
      col.Cell = ({ row }) => {
        const val = get(row.original, field) ?? null
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
    if (!col.accessorFn) {
      col.accessorFn = (originalRow) => {
        return get(originalRow, field) ?? null
      }
    }
    return col
  })
  return columns
}

const useTableState = (initialState, type, persistState, columnsRef) => {
  const [localState, setLocalState] = useState({})
  const [stateLoaded, setStateLoaded] = useState(false)

  useEffect(() => {
    const storedState = type
      ? JSON.parse(sessionStorage.getItem(`${type}_table_state`))
      : null
    const mergedState = merge(
      initialState,
      processStoredState(storedState, columnsRef)
    )
    setLocalState(mergedState)
    setStateLoaded(true)
  }, [type, initialState, columnsRef])

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
  type,
}) => {
  const handleExportRows = (data) => {
    const columns = table
      .getVisibleFlatColumns()
      .filter((col) => !col.id.match(/^mrt/))
      .sort((a, b) => columnOrder.indexOf(a.id) - columnOrder.indexOf(b.id))
    const rows = data.map((row) => {
      return columns.reduce((acc, { columnDef: { id, header, Cell } }) => {
        const cell = row.getVisibleCells().find((c) => c.column.id === id)
        let value = Cell
          ? extractTextFromJSXRender(
              flexRender(Cell, {
                renderedCellValue: cell.renderValue(),
                ...cell.getContext(),
              })
            )
          : cell.renderValue()
        acc[header] = value === null || value === undefined ? '' : value
        return acc
      }, {})
    })
    const csv = generateCsv(csvConfig)(rows)
    const filename = `${type || 'download'}-${dayjs().tz().format('YYYY-MM-DD_hh-mm-A')}`
    download({
      csvConfig,
      filename,
    })(csv)
  }
  return (
    <Stack
      direction="row"
      sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}
      spacing={0}
    >
      {reload && (
        <Tooltip title="Refresh Data">
          <IconButton onClick={() => reload()} size="small">
            <Refresh />
          </IconButton>
        </Tooltip>
      )}
      {!disableDownload && (
        <Tooltip title="Save as spreadsheet (CSV)">
          <span>
            <IconButton
              size="small"
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
    </Stack>
  )
}

const processStoredState = (state, columnsRef) => {
  // Process existing filters
  if (state?.columnFilters) {
    state.columnFilters = (state.columnFilters || []).reduce(
      (acc, { id, value }) => {
        const colDef = columnsRef.current.find((c) => c.id === id)
        if (colDef?.fieldType === 'date' || colDef?.fieldType === 'date-time') {
          if (isArray(value)) {
            value = value.map((v) => {
              return v ? dayjs(v) : v
            })
          } else {
            value = dayjs(value)
          }
        }
        if (isArray(value) && !value.find((v) => v)) {
          return acc
        }
        acc.push({ id, value })
        return acc
      },
      []
    )
  }

  // Add visibility processing
  if (state?.columnVisibility) {
    // Get all current column IDs
    const currentColumnIds = columnsRef.current.map(
      (col) => col.id || col.accessorKey
    )

    // Set any new columns (not in saved state) to hidden
    currentColumnIds.forEach((colId) => {
      const column = columnsRef.current.find(
        (col) => (col.id || col.accessorKey) === colId
      )
      // Always show pre/post columns, hide other new columns
      if (state.columnVisibility[colId] === undefined) {
        state.columnVisibility[colId] = column.isPre || column.isPost || false
      }
    })
  }

  return state
}

const DataTable = ({
  data = [],
  schema = {},
  displayColumns = [],
  tableProps = { initialState: {} },
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
  footerNotes,
}) => {
  const [reloading, setReloading] = useState(false)
  const mediumLayout = useContainerWidth(870)
  const smallLayout = useContainerWidth(680)
  const extraSmallLayout = useContainerWidth(500)

  const visibleColumns = [
    ...displayColumns,
    ...[...preColumns, ...postColumns].map((c) => c.accessorKey),
  ]

  const reload = async () => {
    setReloading(true)
    try {
      await refetch()
    } finally {
      setReloading(false)
    }
  }

  const columns = [
    ...preColumns.map((col) => ({ ...col, isPre: true })),
    ...defineColumns(schema, displayColumns, visibleColumns, customFields),
    ...postColumns.map((col) => ({ ...col, isPost: true })),
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
          if (column.filterFn) {
            acc[column.accessorKey] = column.filterFn
          } else {
            acc[column.accessorKey] = getDefaultColumnFilterFn(column)
          }
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
    persistState,
    columnsRef
  )

  const loadState = (state) => {
    state = processStoredState(state, columnsRef)
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
    saveState(state)
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
    layoutMode: 'semantic',
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
    muiFilterTextFieldProps: {
      placeholder: '',
    },
    muiFilterCheckboxProps: {
      title: '',
    },
    muiTableBodyProps: {
      sx: (theme) => ({
        backgroundColor: '#fff',
        '& tr:nth-of-type(odd) > td, & tr:nth-of-type(odd) > td[data-pinned="true"]:before':
          {
            backgroundColor: 'grey.100',
            ...theme.applyStyles('dark', {
              backgroundColor: 'background.paper',
            }),
          },
      }),
    },
    muiTableContainerProps: ({ table }) => ({
      sx: {
        height: (theme) =>
          theme?.custom?.scrollAreaHeight ||
          (table.getState().isFullScreen ? 0 : 500),
      },
    }),
    muiSearchTextFieldProps: {
      placeholder: 'Search All Fields',
      size: 'x-small',
      style: {
        maxWidth: '185px',
      },
    },

    muiSkeletonProps: {
      animation: 'wave',
    },
    muiTableHeadCellProps: {
      sx: {
        '.Mui-TableHeadCell-Content-Wrapper': {
          whiteSpace: 'nowrap',
        },
      },
    },

    renderTopToolbarCustomActions: ({ table }) => (
      <ToolbarActions
        table={table}
        reload={refetch && reload}
        disableDownload={disableDownload}
        manageViews={!extraSmallLayout && manageViews}
        state={state}
        loadState={loadState}
        initialState={initialState}
        actionButtons={actionButtons}
        columnOrder={columnOrder}
        type={type}
      />
    ),
  }

  if (footerNotes) {
    defaultProps.renderBottomToolbarCustomActions = () => {
      if (!mediumLayout) {
        return footerNotes
      }
    }
    defaultProps.muiBottomToolbarProps = {
      sx: {
        '& > .MuiBox-root': {
          py: 0,
        },
      },
    }
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

  if (state.columnFilters.length) {
    state.showColumnFilters = true
  }

  if (reloading) {
    state.showProgressBars = true
  }
  const properties = merge(defaultProps, tableProps)
  properties.data = stateLoaded ? data : []

  if (globalFilter || tableProps?.initialState?.showGlobalFilter) {
    properties.initialState.showGlobalFilter = globalFilter
    // state.showGlobalFilter = !extraSmallLayout
    if (extraSmallLayout) {
      state.showGlobalFilter = false
      properties.enableGlobalFilter = false
    }
  }

  // if (globalFilter || tableProps?.initialState?.showGlobalFilter) {
  //   properties.initialState.showGlobalFilter = true
  //   properties.enableGlobalFilter = true
  //   state.showGlobalFilter = true

  //   if (extraSmallLayout) {
  //     state.showGlobalFilter = false
  //   }
  // }

  properties.state = state

  const table = useMaterialReactTable(properties)

  return <MaterialReactTable table={table} />
}

export default DataTable
