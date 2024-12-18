import { useRef, useState } from 'react'

import { Add, Delete, Edit, Save } from '@mui/icons-material'
import {
  Button,
  ButtonGroup,
  IconButton,
  MenuItem,
  Paper,
  Popover,
  TextField,
  Tooltip,
} from '@mui/material'
import { Stack } from '@mui/system'
import { useConfirm } from 'material-ui-confirm'

import { useMutation, useQuery } from '@redwoodjs/web'

const CREATE_TABLE_VIEW_MUTATION = gql`
  mutation CreateTableViewMutation($input: CreateTableViewInput!) {
    createTableView(input: $input) {
      id
    }
  }
`
const DELETE_TABLE_VIEW_MUTATION = gql`
  mutation DeleteTableViewMutation($id: Int!) {
    deleteTableView(id: $id) {
      id
    }
  }
`
const UPDATE_TABLE_VIEW_MUTATION = gql`
  mutation UpdateTableViewMutation($id: Int!, $input: UpdateTableViewInput!) {
    updateTableView(id: $id, input: $input) {
      name
    }
  }
`

const FETCH_TABLE_VIEWS = gql`
  query FindTableViews {
    tableViews {
      id
      name
      state
      type
      created_at
      created_by_id
      updated_at
      updated_by_id
    }
  }
`
// FIXME = type is hardcoded to arrests

const ManageViews = ({ tableState, setTableState, defaultState }) => {
  const defaultView = useRef({
    id: 0,
    name: 'Default',
    state: JSON.stringify(defaultState),
  })

  const [name, setName] = useState('')
  const [tableViews, setTableViews] = useState([])
  const [currentView, setCurrentView] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [editType, setEditType] = useState(null)
  const confirm = useConfirm()

  const { refetch } = useQuery(FETCH_TABLE_VIEWS, {
    onCompleted: ({ tableViews }) => {
      setTableViews(tableViews)
      if (currentView.id) {
        const updated = tableViews.find((view) => view.id === currentView.id)
        setCurrentView(updated)
      }
    },
  })

  const [deleteTableView] = useMutation(DELETE_TABLE_VIEW_MUTATION, {
    onCompleted: refetch,
  })

  const [createTableView] = useMutation(CREATE_TABLE_VIEW_MUTATION, {
    onCompleted: refetch,

    onError: (error) => {
      console.error(error)
    },
  })

  const [updateTableView] = useMutation(UPDATE_TABLE_VIEW_MUTATION, {
    onCompleted: refetch,
    onError: (error) => {
      console.error(error)
    },
  })

  const saveView = async (event) => {
    event.preventDefault()
    closeEdit()
    if (editType === 'create') {
      createTableView({
        variables: {
          input: { name, state: JSON.stringify(tableState), type: 'arrests' },
        },
      })
    } else {
      await updateTableView({
        variables: {
          id: currentView.id,
          input: { name },
        },
      })
    }
  }

  const replaceView = async () => {
    await confirm({
      title: `Are you sure you want to update the view "${currentView.name}" with your current table settings?`,
    })
    await updateTableView({
      variables: {
        id: currentView.id,
        input: {
          state: JSON.stringify(tableState),
        },
      },
    })
  }

  const deleteView = async () => {
    await confirm({
      title: `Are you sure you want to delete the view "${currentView.name}"?`,
    })
    deleteTableView({ variables: { id: currentView.id } })
    loadView({ target: { value: defaultView.current } })
  }

  const loadView = (event) => {
    setCurrentView(event.target.value)
    setTableState(JSON.parse(event.target.value.state))
  }

  const openEdit = (type) => async (event) => {
    event.preventDefault()
    setAnchorEl(event.currentTarget)
    setEditType(type)
    if (type == 'rename') {
      setName(currentView.name)
    } else {
      setName('')
    }
  }

  const closeEdit = (event) => {
    if (event) {
      event.preventDefault()
    }
    setEditType(null)
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined
  return (
    <>
      <Stack
        direction="row"
        spacing={0}
        sx={{
          alignItems: 'center',
        }}
      >
        <ButtonGroup
          variant="text"
          size="x-small"
          color="inherit"
          sx={{
            color: 'text.secondary',
            '& .MuiButton-root': {
              border:
                '1px solid rgba(var(--mui-palette-common-onBackgroundChannel) / 0.23)',
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              borderRight: 0,
            },
          }}
          disabled={currentView?.name === 'Default' || !currentView?.name}
        >
          <Tooltip title="Create new view from current settings">
            <span>
              <Button onClick={(event) => openEdit('create')(event)}>
                <Add />
              </Button>
            </span>
          </Tooltip>
        </ButtonGroup>
        <Popover
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={closeEdit}
        >
          <Paper sx={{ padding: 2, marginTop: 1 }}>
            <TextField
              label="View Name"
              size="x-small"
              autoFocus // eslint-disable-line jsx-a11y/no-autofocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  saveView(e)
                  closeEdit(e)
                }
              }}
            />
            <Tooltip title="Save View">
              <IconButton onClick={saveView}>
                <Save />
              </IconButton>
            </Tooltip>
          </Paper>
        </Popover>
        <TextField
          label="Load View"
          size="x-small"
          select
          value={currentView}
          onChange={loadView}
          sx={{ minWidth: 130 }}
          fullWidth
          InputProps={{
            sx: {
              borderRadius: 0,
            },
          }}
        >
          <MenuItem key="__blank" value={defaultView.current}>
            Default
          </MenuItem>
          {tableViews.map((view) => {
            return (
              <MenuItem key={view.id} value={view}>
                {view.name}
              </MenuItem>
            )
          })}
        </TextField>

        <ButtonGroup
          variant="text"
          size="x-small"
          color="inherit"
          sx={{
            color: 'text.secondary',
            '& .MuiButton-root': {
              border:
                '1px solid rgba(var(--mui-palette-common-onBackgroundChannel) / 0.23)',
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              borderLeft: 0,
            },
          }}
          disabled={currentView?.name === 'Default' || !currentView?.name}
        >
          <Tooltip title="Rename Current View">
            <span>
              <Button onClick={openEdit('rename')}>
                <Edit />
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Update Current View">
            <span>
              <Button onClick={() => replaceView()}>
                <Save />
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Delete Current View">
            <span>
              <Button onClick={() => deleteView()}>
                <Delete />
              </Button>
            </span>
          </Tooltip>
        </ButtonGroup>
      </Stack>
    </>
  )
}

export default ManageViews
