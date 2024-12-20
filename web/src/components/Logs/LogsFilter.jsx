import { useState } from 'react'

import {
  FilterList,
  FilterListOff,
  Flag,
  Person,
  Search,
} from '@mui/icons-material'
import {
  Box,
  Collapse,
  Grid2,
  InputAdornment,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material'
import { FormContainer } from 'react-hook-form-mui'

import { useRoutePath } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
// import { LOG_FIELDS } from 'src/components/Logs/LogsForm'
import { useApp } from 'src/lib/AppContext'
import { fieldSchema } from 'src/lib/FieldSchemas'

import { Field } from '../utils/Field'
import LoadingButton from '../utils/LoadingButton'

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
                <Grid2 key={name} alignContent={'center'} size={6}>
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

export default LogsFilter
