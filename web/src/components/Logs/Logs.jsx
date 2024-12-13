import { useCallback, useEffect, useMemo, useState } from 'react'

import { useLazyQuery } from '@apollo/client'
import { Add, FilterList, FilterListOff, Search } from '@mui/icons-material'
import {
  Button,
  Card,
  CardContent,
  Collapse,
  IconButton,
  InputAdornment,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material'
import { default as Grid2 } from '@mui/material/Unstable_Grid2/Grid2'
import { Box, Stack } from '@mui/system'
import { FormContainer, useForm } from 'react-hook-form-mui'

import { navigate, useLocation } from '@redwoodjs/router'

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
const Logs = ({ sidebar = false }) => {
  const { currentAction } = useApp()
  const { pathname, search } = useLocation()
  const [logs, setLogs] = useState([])
  const [editItem, setEditItem] = useState(false)
  const [showFilters, setShowFilters] = useState(sidebar ? false : true)
  const [loading, setLoading] = useState(true)

  const defaultValues = {}
  if (currentAction && currentAction.id !== -1) {
    defaultValues.action = currentAction
  }
  const context = useForm({ defaultValues })
  const { getValues } = context
  const [fetchLogs] = useLazyQuery(QUERY)

  useEffect(() => {
    if (!sidebar && search.includes('new=true')) {
      setEditItem('new')
    }
  }, [search, sidebar])

  const onCreate = (success) => {
    setEditItem('')
    navigate(pathname)
    success && searchLogs()
  }

  const debouncedSearchLogs = useMemo(() => {
    return asyncDebounce(() => {
      return (async () => {
        const values = getValues()
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
        if (values.arrests) {
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
        if (values.users) {
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
    searchLogs()
  }, [searchLogs])

  const filterFields = [
    ['needs_followup', { field_type: 'checkbox' }],
    ['type', { field_type: 'select', options: fieldSchema.log.type.options }],
    ['after_date', { field_type: 'date-time', label: 'Created After' }],
    ['before_date', { field_type: 'date-time', label: 'Created Before' }],
    ['action', { field_type: 'action_chooser' }],
    ['arrests', { field_type: 'arrest_chooser', multiple: true }],
    ['users', { field_type: 'user_chooser', multiple: true }],
  ]

  return (
    <Stack spacing={2} sx={{ px: sidebar ? 1 : 0 }}>
      {sidebar && (
        <Box sx={{ textAlign: 'right' }}>
          <Button
            startIcon={<Add />}
            onClick={() => setEditItem('new')}
            variant="contained"
            color="secondary"
          >
            New Log
          </Button>
        </Box>
      )}
      {editItem === 'new' && (
        <Card>
          <CardContent>
            <LogsForm callback={onCreate} />
          </CardContent>
        </Card>
      )}

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
                size="small"
                label="Search Logs"
                name="searchString"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <Tooltip
                title={`${showFilters ? 'Hide' : 'Show'} Additional Filters`}
              >
                <IconButton onClick={() => setShowFilters(!showFilters)}>
                  {showFilters ? <FilterListOff /> : <FilterList />}
                </IconButton>
              </Tooltip>
            </Stack>
            <Collapse in={showFilters}>
              <Grid2
                container
                spacing={2}
                sx={{ width: '100%', '&>*': { width: '50%', mt: 1 } }}
              >
                {filterFields.map(
                  ([name, { field_type = 'text', ...props }]) => (
                    <Grid2 key={name} xs={6} alignContent={'center'}>
                      <Field name={name} field_type={field_type} {...props} />
                    </Grid2>
                  )
                )}
              </Grid2>
            </Collapse>
            <Box sx={{ textAlign: 'right' }}>
              <LoadingButton variant="outlined" type="submit" loading={loading}>
                Filter Logs
              </LoadingButton>
            </Box>
          </Stack>
        </FormContainer>
      </Paper>
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
