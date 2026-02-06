import { useCallback, useEffect, useState } from 'react'

import {
  AccountBoxOutlined,
  FilterList,
  FilterListOff,
  Flag,
  Person,
  Search,
  Subject,
} from '@mui/icons-material'
import {
  Box,
  Chip,
  Collapse,
  Grid2,
  InputAdornment,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material'
import { get } from 'lodash-es'
import { FormContainer, useFormContext } from 'react-hook-form-mui'

import { useRoutePath } from '@cedarjs/router'

import { useAuth } from 'src/auth'
import { formatLabel } from 'src/components/utils/BaseField'
import FormSection from 'src/components/utils/FormSection'
import IconText from 'src/components/utils/IconText'
import Show from 'src/components/utils/Show'
import { useApp } from 'src/lib/AppContext'

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

const LogsFilterSummary = ({ filterFields, updateAndSubmit }) => {
  const { watch } = useFormContext()

  const values = watch()
  const displayValue = (field_type, value) => {
    switch (field_type) {
      case 'checkbox':
        return value ? 'Yes' : 'No'
      case 'date-time':
        return value.format('M/D/YYYY h:mm A')
      case 'arrest_chooser':
        return value.map((a) => a.arrestee.search_display_field).join(', ')
      case 'action_chooser':
        return value?.name || ''
      case 'user_chooser':
        return value.map((u) => u.name).join(', ')
      default:
        return value
    }
  }

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ width: '100%' }}
      flexWrap={'wrap'}
      useFlexGap
    >
      {filterFields.map(([name, { field_type = 'text', label }]) => {
        const value = get(values, name)
        if (
          value &&
          ((Array.isArray(value) && value.length) || !Array.isArray(value))
        ) {
          return (
            <Chip
              onDelete={() => updateAndSubmit(name, null)}
              key={name}
              label={
                <span>
                  <b>{label || formatLabel(name)}: </b>
                  {displayValue(field_type, value) || ''}
                </span>
              }
              size="small"
            />
          )
        }
      })}
    </Stack>
  )
}

const LogsFilter = ({
  sidebar = false,
  searchLogs,
  context,
  loading = false,
}) => {
  const [showFilters, setShowFilters] = useState(sidebar ? false : true)
  const [filterCurrentArrest, setFilterCurrentArrest] = useState(false)
  const { currentAction, currentFormData } = useApp()
  const { currentUser } = useAuth()
  const path = useRoutePath()
  const filterFields = [
    ['needs_followup', { field_type: 'checkbox' }],
    ['type', { field_type: 'select', optionSet: 'log_type' }],
    ['after_date', { field_type: 'date-time', label: 'Created After' }],
    ['before_date', { field_type: 'date-time', label: 'Created Before' }],
    ['action', { field_type: 'action_chooser' }],
    ['arrests', { field_type: 'arrest_chooser', multiple: true }],
    ['users', { field_type: 'user_chooser', multiple: true }],
    ['contact', {}],
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

  const updateAndSubmit = useCallback(
    (field, value) => {
      context.setValue(field, value)
      context.handleSubmit(searchLogs)()
    },
    [context, searchLogs]
  )

  useEffect(() => {
    if (sidebar) {
      const shouldFilter =
        path.includes('arrests') && currentFormData?.id && filterCurrentArrest
      if (shouldFilter) {
        if (context.getValues('arrests')?.[0]?.id !== currentFormData.id) {
          updateAndSubmit('arrests', [currentFormData])
        }
      } else {
        // if (context.getValues('arrests')?.length) {
        //   updateAndSubmit('arrests', [])
        // }
      }
    }
  }, [
    path,
    currentFormData,
    filterArrest,
    filterCurrentArrest,
    sidebar,
    context,
    searchLogs,
    updateAndSubmit,
  ])

  if (showFilters) toggles.push('showFilters')
  if (filterAction) toggles.push('action')
  if (filterCurrentArrest) toggles.push('arrest')
  if (filterUser) toggles.push('user')
  if (type === 'Shift Summary') toggles.push('shiftSummaries')

  const toggleButtons = [
    {
      label: 'Shift Summaries',
      icon: Subject,
      value: 'shiftSummaries',
      action: () => {
        updateAndSubmit(
          'type',
          type === 'Shift Summary' ? null : 'Shift Summary'
        )
      },
    },
    {
      label: 'Current Action',
      icon: Flag,
      value: 'action',
      action: () => {
        updateAndSubmit('action', filterAction ? null : currentAction)
      },
      disabled: !currentAction.id || currentAction.id === -1,
    },
    {
      label: 'Current Arrest',
      icon: AccountBoxOutlined,
      value: 'arrest',
      action: () => {
        setFilterCurrentArrest(!filterCurrentArrest)
        if (filterCurrentArrest) {
          updateAndSubmit('arrests', [])
        }
      },
      disabled: !currentFormData?.id || !path.includes('arrests'),
      hidden: !sidebar,
    },
    {
      label: 'Current User',
      icon: Person,
      value: 'user',
      action: () => {
        updateAndSubmit('users', filterUser ? [] : [currentUser])
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
      onSuccess={async (data) => {
        await searchLogs(data)
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
          <Show when={!showFilters}>
            <LogsFilterSummary
              filterFields={filterFields}
              updateAndSubmit={updateAndSubmit}
            />
          </Show>
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
