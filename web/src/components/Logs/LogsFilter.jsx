import { useState } from 'react'

import {
  FilterList,
  FilterListOff,
  Flag,
  Person,
  Search,
  Subject,
} from '@mui/icons-material'
import {
  Box,
  Collapse,
  Grid2,
  InputAdornment,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material'
import { FormContainer } from 'react-hook-form-mui'

import { useRoutePath } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import FormSection from 'src/components/utils/FormSection'
import IconText from 'src/components/utils/IconText'
import { useApp } from 'src/lib/AppContext'
import { fieldSchema } from 'src/lib/FieldSchemas'

import { Field } from '../utils/Field'
import LoadingButton from '../utils/LoadingButton'

function LogsFilterToggles({ toggles, sidebar, expanded, toggleButtons }) {
  const size = !sidebar ? 'small' : 'x-small'
  return (
    <ToggleButtonGroup size={size} value={toggles}>
      {toggleButtons.map(
        ({ value, action, disabled, label, icon: Icon, hidden, tooltip }) =>
          !hidden &&
          (sidebar ||
            (!expanded && value === 'showFilters') ||
            (expanded && value !== 'showFilters')) && (
            <Tooltip
              key={value}
              title={
                tooltip ||
                `${toggles[value] ? 'Disable' : 'Enable'} Filter on ${label}`
              }
            >
              <span>
                <ToggleButton
                  value={value}
                  onClick={action}
                  disabled={disabled}
                >
                  <IconText
                    icon={Icon}
                    size={size === 'small' ? 'medium' : 'small'}
                  >
                    {expanded && label}
                  </IconText>
                </ToggleButton>
              </span>
            </Tooltip>
          )
      )}
    </ToggleButtonGroup>
  )
}

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
  const type = context.watch('type')

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
  if (type === 'Shift Summary') toggles.push('shiftSummaries')

  const toggleButtons = [
    {
      label: 'Shift Summaries',
      icon: Subject,
      value: 'shiftSummaries',
      action: () => {
        context.setValue(
          'type',
          type === 'Shift Summary' ? null : 'Shift Summary'
        )
        context.handleSubmit(searchLogs)()
      },
    },
    {
      label: 'Current Action',
      icon: Flag,
      value: 'action',
      action: () => {
        context.setValue('action', filterAction ? null : currentAction)
        context.handleSubmit(searchLogs)()
      },
      disabled: !currentAction.id || currentAction.id === -1,
    },
    {
      label: 'Current Arrest',
      icon: Person,
      value: 'arrest',
      action: () => {
        context.setValue('arrests', filterArrest ? [] : [currentFormData])
        context.handleSubmit(searchLogs)()
      },
      disabled: !currentFormData?.id || !path.includes('arrests'),
      hidden: !path.includes('arrests'),
    },
    {
      label: 'Current User',
      icon: Person,
      value: 'user',
      action: () => {
        context.setValue('users', filterUser ? [] : [currentUser])
        context.handleSubmit(searchLogs)()
      },
      disabled: !currentUser?.id,
    },
    {
      label: `${showFilters ? 'Hide' : 'Show'} Filters`,
      icon: showFilters ? FilterListOff : FilterList,
      value: 'showFilters',
      tooltip: `${showFilters ? 'Hide' : 'Show'} Additional Filters`,
      action: () => {
        setShowFilters(!showFilters)
      },
    },
  ]
  return (
    <FormContainer
      formContext={context}
      onSuccess={(data) => {
        searchLogs(data)
      }}
    >
      <FormSection
        title={<IconText icon={FilterList}>Filter Logs</IconText>}
        small={sidebar}
        sticky={false}
      >
        <Stack direction="column" spacing={1}>
          {!sidebar && (
            <>
              <LogsFilterToggles
                toggleButtons={toggleButtons}
                toggles={toggles}
                expanded
                sidebar={sidebar}
              />
            </>
          )}
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Field
              fullWidth
              size={sidebar ? 'x-small' : 'small'}
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
            <LogsFilterToggles
              toggleButtons={toggleButtons}
              toggles={toggles}
              sidebar={sidebar}
            />
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
              startIcon={<FilterList />}
            >
              Filter Logs
            </LoadingButton>
          </Box>
        </Stack>
      </FormSection>
    </FormContainer>
  )
}

export default LogsFilter
