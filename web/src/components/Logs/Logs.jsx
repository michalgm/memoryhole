import { useCallback, useEffect, useMemo, useState } from 'react'

import { useLazyQuery } from '@apollo/client'
import { Add } from '@mui/icons-material'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useForm } from 'react-hook-form-mui'
import InfiniteScroll from 'react-infinite-scroll-component'

import { navigate, routes, useLocation } from '@redwoodjs/router'

import LogsFilter from 'src/components/Logs/LogsFilter'
import LogsForm from 'src/components/Logs/LogsForm'
import FormSection from 'src/components/utils/FormSection'
import Show from 'src/components/utils/Show'
import { useApp } from 'src/lib/AppContext'
import { asyncDebounce } from 'src/lib/utils'

import Loading from '../Loading/Loading'

import Log from './Log'

export const QUERY = gql`
  query FetchLogs($params: QueryParams) {
    logs: logs(params: $params) {
      ...LogFields
    }
  }
`

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
  const { search } = useLocation()
  const [logs, setLogs] = useState([])
  const [editItem, setEditItem] = useState(false)
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [skip, setSkip] = useState(0)
  const ITEMS_PER_PAGE = 20

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

  const debouncedSearchLogs = useMemo(() => {
    return asyncDebounce((skip) => {
      return (async () => {
        const values = getValues()
        const { where } = processQuery(values)
        const logs = await fetchLogs({
          variables: { params: { where, take: ITEMS_PER_PAGE, skip } },
        })
        if (logs?.data?.logs) {
          setLogs((prev) => [...(skip === 0 ? [] : prev), ...logs.data.logs])
          setHasMore(logs.data.logs.length === ITEMS_PER_PAGE)
        }
      })()
    }, 1000)
  }, [fetchLogs, getValues])

  const searchLogs = useCallback(
    async (skip) => {
      setLoading(true)
      try {
        await debouncedSearchLogs(skip)
      } catch (e) {
        console.error(e)
      }

      setLoading(false)
    },
    [debouncedSearchLogs]
  )

  useEffect(() => {
    searchLogs(skip)
  }, [searchLogs, skip])

  const filterLogs = useCallback(() => {
    setSkip(0)
    setLogs([])
    setHasMore(true)
    return searchLogs(0)
  }, [searchLogs])

  const onCreate = useCallback(
    (success) => {
      setEditItem(false)
      success && filterLogs()
      onNewLogComplete && onNewLogComplete()
      !sidebar && navigate(routes.logs({}))
    },
    [filterLogs, onNewLogComplete, sidebar]
  )

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
        <FormSection title="New Log" small={sidebar}>
          <LogsForm callback={onCreate} sidebar={sidebar} />
        </FormSection>
      )}
      <LogsFilter
        sidebar={sidebar}
        searchLogs={filterLogs}
        context={context}
        loading={loading}
      />
      <div data-testid="logs-page-logs-container">
        <InfiniteScroll
          dataLength={logs.length}
          next={() => setSkip((prev) => prev + ITEMS_PER_PAGE)}
          hasMore={hasMore}
          loader={<Loading name="loading-logs" />}
          scrollableTarget={
            sidebar ? 'arrestee-logs-drawer-container' : 'main-content'
          }
          endMessage={
            <Show when={logs.length === 0}>
              <Typography variant="h6" align="center">
                No Logs Match Search
              </Typography>
            </Show>
          }
          className="MuiStack-root"
          style={{
            gap: '16px',
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: 16,
            overflow: 'visible',
          }}
        >
          {logs.map((item) => (
            <Log
              key={item.id}
              log={item}
              editItem={editItem}
              setEditItem={setEditItem}
              onCreate={onCreate}
            />
          ))}
        </InfiniteScroll>
      </div>
      {/* <div
        style={{
          position: 'fixed',
          bottom: sidebar ? 40 : 10,
          right: 10,
          zIndex: 10000,
          backgroundColor: 'white',
        }}
      >
        hasMore: {hasMore.toString()}
        count: {logs.length}
        skip: {skip}
      </div> */}
    </Stack>
  )
}

export default Logs
