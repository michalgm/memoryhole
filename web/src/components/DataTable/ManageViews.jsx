import { useRef, useState } from 'react'

import { Add, Delete, Edit, Save } from '@mui/icons-material'
import {
  Button,
  ButtonGroup,
  FormGroup,
  IconButton,
  MenuItem,
  Paper,
  Popover,
  TextField,
  Tooltip,
} from '@mui/material'
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
    onCompleted: ({ tableViews }) => setTableViews(tableViews),
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

  const deleteView = async () => {
    await confirm({
      title: `Are you sure you want to delete the view '${currentView.name}'?`,
    })
    deleteTableView({ variables: { id: currentView.id } })
    setName('Default')
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
      <FormGroup
        row
        sx={{
          transform: 'scale(0.8)',
        }}
      >
        <Tooltip title="Create new view from current settings">
          <Button
            type="button"
            variant="outlined"
            size="small"
            onClick={(event) => openEdit('create')(event)}
            sx={{ minWidth: 40, marginRight: 1 }}
          >
            <Add />
          </Button>
        </Tooltip>
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
              size="small"
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

        <ButtonGroup
          variant="outlined"
          size="small"
          disabled={currentView?.name === 'Default'}
        >
          <TextField
            label="Load View"
            size="small"
            select
            value={currentView}
            onChange={loadView}
            sx={{ minWidth: 130 }}
            fullWidth
            InputProps={{
              sx: {
                borderBottomRightRadius: 0,
                borderTopRightRadius: 0,
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
          <Button onClick={openEdit('rename')}>
            <Tooltip title="Rename Current View">
              <Edit />
            </Tooltip>
          </Button>
          <Button onClick={() => deleteView()}>
            <Tooltip title="Delete Current View">
              <Delete />
            </Tooltip>
          </Button>
        </ButtonGroup>
      </FormGroup>
    </>
  )
}

export default ManageViews
