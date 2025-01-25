import { useCallback, useMemo } from 'react'

import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { startCase, upperCase } from 'lodash-es'

import { navigate, routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import FormContainer from 'src/components/utils/FormContainer'
import { useApp } from 'src/lib/AppContext'
import { useSiteSettings } from 'src/lib/useSiteSettings'
export const QUERY = gql`
  query EditUser($id: Int!) {
    user: user(id: $id) {
      ...UserFields
    }
  }
`

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: Int!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      ...UserFields
    }
  }
`

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ...UserFields
    }
  }
`

const DELETE_USER_MUTATION = gql`
  mutation deleteUser($id: Int!) {
    deleteUser(id: $id) {
      id
    }
  }
`
export const transformInput = (input) => {
  const fieldsToRemove = ['id', '__typename']
  fieldsToRemove.forEach((k) => delete input[k])
  if (input.actions) {
    input.action_ids = input.actions.map(({ id }) => id)
    delete input.actions
  }
  return input
}

const applyDefaults = (
  role,
  target,
  restriction_settings,
  default_restrictions
) => {
  const defaults = default_restrictions[(role || '').toLowerCase()]
  if (!defaults) {
    return
  }
  const updateValues = () => {
    Object.entries(restriction_settings)
      .filter(([, v]) => v)
      .forEach(([field]) => {
        if (!(field in defaults)) {
          return
        }
        let value = defaults[field]
        if (value && field !== 'arrest_date_threshold') {
          const operation =
            defaults[`${field}_direction`] === 'before' ? 'subtract' : 'add'
          value = dayjs()[operation](value, 'day').endOf('day')
        }
        if (target.setValue) {
          target.setValue(field, value, { shouldDirty: true })
        } else {
          target[field] = value
        }
      })
  }

  if (target.batch) {
    target.batch(updateValues)
  } else {
    updateValues()
  }
}

const DefaultsTooltip = ({ default_restrictions, restriction_settings }) => (
  <Box>
    {Object.entries(default_restrictions || {}).map(([role, values]) => {
      return (
        <Box key={role}>
          <Typography variant="subtitle2">{upperCase(role)}:</Typography>
          <Box pl={2}>
            {Object.entries(restriction_settings)
              .filter(([, enabled]) => enabled)
              .map(([field]) => {
                let value = ''
                if (!(field in values)) {
                  return null
                }
                if (!values[field]) {
                  value = 'N/A'
                } else if (field === 'arrest_date_threshold') {
                  value = `${values[field]} days`
                } else {
                  const direction =
                    values[`${field}_direction`] === 'before'
                      ? 'subtract'
                      : 'add'
                  value = `${direction === 'add' ? '+' : '-'}${values[field]} days from now`
                }
                return (
                  <Typography
                    variant="caption"
                    sx={{ display: 'block' }}
                    key={field}
                  >
                    {startCase(field)}: {value}
                  </Typography>
                )
              })}
          </Box>
        </Box>
      )
    })}
  </Box>
)

const UserPage = ({ id }) => {
  const { setPageTitle } = useApp()
  const { currentUser } = useAuth()
  const {
    settings: { restriction_settings, default_restrictions },
  } = useSiteSettings(['restriction_settings', 'default_restrictions'])

  const isCreate = !id || id === 'new'

  const applyDefaultsToUser = useCallback(
    (role, target) => {
      applyDefaults(role, target, restriction_settings, default_restrictions)
    },
    [restriction_settings, default_restrictions]
  )

  const onFetch = useCallback(
    (user) => {
      setPageTitle(isCreate ? 'New User' : user?.name)
      if (isCreate) {
        user.role = 'User'
        applyDefaultsToUser(user.role, user)
      }
      return user
    },
    [setPageTitle, isCreate, applyDefaultsToUser]
  )

  const onDelete = useCallback(() => {
    navigate(routes.users())
  }, [])

  const onCreate = useCallback((data) => {
    navigate(routes.user({ id: data.id }))
  }, [])

  const layout = useMemo(
    () => [
      {
        title: 'User Details',
        fields: ['name', 'email', 'role'],
      },
      {
        title: 'Restrict Access',
        fields: restriction_settings
          ? Object.keys(restriction_settings).filter(
              (k) => restriction_settings[k]
            )
          : [],
        sectionActions: [
          {
            label: 'Update Restrictions to Defaults',
            onClick: (e, context) => {
              const role = context.getValues('role')
              applyDefaultsToUser(role, context)
            },
            tooltip: (
              <DefaultsTooltip
                restriction_settings={restriction_settings}
                default_restrictions={default_restrictions}
              />
            ),
          },
        ],
      },
    ],
    [restriction_settings, default_restrictions, applyDefaultsToUser]
  )

  const fieldProps = useMemo(() => {
    const fieldProps = {
      role: {
        onChange: (value, context) => {
          applyDefaultsToUser(value, context)
        },
      },
    }
    layout[1].fields.forEach((field) => {
      if (currentUser.id === id) {
        fieldProps[field] = { disabled: true }
      }
    })
    return fieldProps
  }, [currentUser, id, layout, applyDefaultsToUser])

  return (
    <>
      <FormContainer
        fieldProps={fieldProps}
        layout={layout}
        id={id === 'new' ? null : id}
        displayConfig={{
          type: 'User',
          name: 'name',
        }}
        columnCount={1}
        skipUpdatedCheck
        fetchQuery={QUERY}
        createMutation={CREATE_USER_MUTATION}
        updateMutation={UPDATE_USER_MUTATION}
        deleteMutation={DELETE_USER_MUTATION}
        transformInput={transformInput}
        onDelete={onDelete}
        onCreate={onCreate}
        onFetch={onFetch}
      />
    </>
  )
}

export default UserPage
