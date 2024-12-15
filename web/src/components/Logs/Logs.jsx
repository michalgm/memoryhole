import { useCallback, useEffect, useMemo, useState } from 'react'

import { useLazyQuery } from '@apollo/client'
import {
  Add,
  FilterList,
  FilterListOff,
  Flag,
  Person,
  Search,
} from '@mui/icons-material'
import {
  Button,
  Card,
  CardContent,
  Collapse,
  InputAdornment,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material'
import { default as Grid2 } from '@mui/material/Unstable_Grid2/Grid2'
import { Box, Stack } from '@mui/system'
import { FormContainer, useForm } from 'react-hook-form-mui'

import { navigate, useLocation, useRoutePath } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import { LOG_FIELDS } from 'src/components/Logs/LogsForm'
import { useApp } from 'src/lib/AppContext'
import { fieldSchema } from 'src/lib/FieldSchemas'
import { asyncDebounce } from 'src/lib/utils'

import Loading from '../Loading/Loading'
import { Field } from '../utils/Field'
import LoadingButton from '../utils/LoadingButton'

import Log from './Log'
import LogsForm from './LogsForm'

export const QUERY = gql`
  ${LOG_FIELDS}
  query FetchLogs($params: QueryParams) {
    logs: logs(params: $params) {
      ...LogFields
    }
  }
`

const LogsFilter = ({
  sidebar = false,
  searchLogs,
  context,
  loading = false,
}) => {
  const [showFilters, setShowFilters] = useState(sidebar ? false : true)
  const { currentAction, currentFormData } = useApp()
  const { currentUser } = useAuth()
  const path = useRoutePath()

  const filterFields = [
    ['needs_followup', { field_type: 'checkbox' }],
    ['type', { field_type: 'select', options: fieldSchema.log.type.options }],
    ['after_date', { field_type: 'date-time', label: 'Created After' }],
    ['before_date', { field_type: 'date-time', label: 'Created Before' }],
    ['action', { field_type: 'action_chooser' }],
    ['arrests', { field_type: 'arrest_chooser', multiple: true }],
    ['users', { field_type: 'user_chooser', multiple: true }],
  ]

  const action = context.watch('action') || {}
  const arrests = context.watch('arrests') || []
  const users = context.watch('users') || []

  const toggles = []
  const filterAction =
    action?.id === currentAction.id && currentAction.id !== -1
  const filterArrest =
    path.includes('arrests') &&
    arrests.filter((a) => a.id == currentFormData?.id).length > 0

  const filterUser = users.filter((u) => u.id == currentUser?.id).length > 0
  if (showFilters) toggles.push('showFilters')
  if (filterAction) toggles.push('action')
  if (filterArrest) toggles.push('arrest')
  if (filterUser) toggles.push('user')

  return (
    <Paper variant="outlined" sx={{ p: 1 }}>
      <FormContainer
        formContext={context}
        onSuccess={(data) => {
          searchLogs(data)
        }}
      >
        <Stack direction="column" spacing={1}>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Field
              fullWidth
              size="x-small"
              label="Search"
              name="searchString"
              onChange={() => context.handleSubmit(searchLogs)()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <ToggleButtonGroup size="x-small" value={toggles}>
              <Tooltip
                title={`${filterAction ? 'Disable' : 'Enable'} Filter on Current Action`}
              >
                <span>
                  <ToggleButton
                    disabled={!currentAction.id || currentAction.id === -1}
                    value="action"
                    onClick={() => {
                      context.setValue(
                        'action',
                        filterAction ? null : currentAction
                      )
                      context.handleSubmit(searchLogs)()
                    }}
                  >
                    <Flag />
                  </ToggleButton>
                </span>
              </Tooltip>
              <Tooltip
                title={`${filterArrest ? 'Disable' : 'Enable'} Filter on Current Arrest`}
              >
                <span>
                  <ToggleButton
                    value="arrest"
                    disabled={!currentFormData?.id || !path.includes('arrests')}
                    onClick={() => {
                      if (filterArrest) {
                        context.setValue('arrests', [])
                      } else {
                        context.setValue('arrests', [currentFormData])
                      }
                      context.handleSubmit(searchLogs)()
                    }}
                  >
                    <Person />
                  </ToggleButton>
                </span>
              </Tooltip>
              <Tooltip
                title={`${filterUser ? 'Disable' : 'Enable'} Filter on Current User`}
              >
                <span>
                  <ToggleButton
                    value="user"
                    onClick={() => {
                      if (filterUser) {
                        context.setValue('users', [])
                      } else {
                        context.setValue('users', [currentUser])
                      }
                      context.handleSubmit(searchLogs)()
                    }}
                  >
                    <Person />
                  </ToggleButton>
                </span>
              </Tooltip>
              <Tooltip
                title={`${showFilters ? 'Hide' : 'Show'} Additional Filters`}
              >
                <span>
                  <ToggleButton
                    value="showFilters"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    {showFilters ? <FilterListOff /> : <FilterList />}
                  </ToggleButton>
                </span>
              </Tooltip>
            </ToggleButtonGroup>
          </Stack>
          <Collapse in={showFilters}>
            <Grid2
              container
              spacing={2}
              sx={{ width: '100%', '&>*': { width: '50%', mt: 1 } }}
            >
              {filterFields.map(([name, { field_type = 'text', ...props }]) => (
                <Grid2 key={name} xs={6} alignContent={'center'}>
                  <Field name={name} field_type={field_type} {...props} />
                </Grid2>
              ))}
            </Grid2>
          </Collapse>
          <Box sx={{ textAlign: 'right' }}>
            <LoadingButton
              size="small"
              variant="outlined"
              type="submit"
              loading={loading}
            >
              Filter Logs
            </LoadingButton>
          </Box>
        </Stack>
      </FormContainer>
    </Paper>
  )
}

const processQuery = (values) => {
  const where = {}
  const queries = []
  if (values.searchString) {
    where.notes = {
      contains: values.searchString,
      mode: 'insensitive',
    }
  }
  if (values.action) {
    where.action = {
      id: values.action.id,
    }
  }
  if (values.type) {
    where.type = values.type
  }
  if (values.arrests?.length) {
    queries.push({
      AND: values.arrests.map((arrest) => ({
        arrests: {
          some: {
            id: arrest.id,
          },
        },
      })),
    })
  }
  if (values.users?.length) {
    queries.push({
      OR: [
        {
          created_by: {
            id: {
              in: values.users.map((a) => a.id),
            },
          },
        },
        {
          updated_by: {
            id: {
              in: values.users.map((a) => a.id),
            },
          },
        },
      ],
    })
  }
  if (values.needs_followup) {
    where.needs_followup = values.needs_followup
  }
  if (values.after_date || values.before_date) {
    where.created_at = {
      ...(values.after_date && { gte: values.after_date }),
      ...(values.before_date && { lte: values.before_date }),
    }
  }
  if (queries.length) {
    where.AND = queries
  }
  return { where }
}

const Logs = ({ sidebar = false, newLogRequested, onNewLogComplete }) => {
  const { currentAction } = useApp()
  const { pathname, search } = useLocation()
  const [logs, setLogs] = useState([])
  const [editItem, setEditItem] = useState(false)
  const [loading, setLoading] = useState(!sidebar)

  const defaultValues = {}
  if (currentAction && currentAction.id !== -1) {
    defaultValues.action = currentAction
  }
  const context = useForm({ defaultValues })
  const { getValues } = context
  const [fetchLogs] = useLazyQuery(QUERY)

  useEffect(() => {
    if ((!sidebar && search.includes('new=true')) || newLogRequested) {
      setEditItem('new')
    }
  }, [search, sidebar, newLogRequested])

  const onCreate = (success) => {
    setEditItem('')
    !sidebar && navigate(pathname)
    success && searchLogs()
    onNewLogComplete && onNewLogComplete()
  }

  const debouncedSearchLogs = useMemo(() => {
    return asyncDebounce(() => {
      return (async () => {
        const values = getValues()
        const { where } = processQuery(values)
        const logs = await fetchLogs({ variables: { params: { where } } })
        if (logs?.data?.logs) {
          setLogs(logs.data.logs)
        }
      })()
    }, 1000)
  }, [fetchLogs, getValues])

  const searchLogs = useCallback(async () => {
    setLoading(true)
    let values = []
    try {
      values = await debouncedSearchLogs()
    } catch (e) {
      console.error(e)
    }

    setLoading(false)
    return values
  }, [debouncedSearchLogs])

  useEffect(() => {
    if (!sidebar) {
      searchLogs()
    }
  }, [searchLogs, sidebar])

  return (
    <Stack spacing={2} sx={{ px: sidebar ? 1 : 0 }}>
      {sidebar && (
        <Box sx={{ textAlign: 'right' }}>
          <Button
            startIcon={<Add />}
            onClick={() => setEditItem('new')}
            variant="contained"
            color="secondary"
            size="small"
          >
            New Log
          </Button>
        </Box>
      )}
      {editItem === 'new' && (
        <Card>
          <CardContent>
            <LogsForm callback={onCreate} sidebar={sidebar} />
          </CardContent>
        </Card>
      )}
      <LogsFilter
        sidebar={sidebar}
        searchLogs={searchLogs}
        context={context}
        loading={loading}
      />
      {loading && <Loading />}
      {!loading && !logs.length && (
        <Typography variant="h6" align="center">
          No Logs Found
        </Typography>
      )}
      {!loading &&
        logs.map((item) => (
          <Log
            key={item.id}
            log={item}
            editItem={editItem}
            setEditItem={setEditItem}
            onCreate={onCreate}
          />
        ))}
    </Stack>
  )
}

export default Logs
