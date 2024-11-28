import { useEffect } from 'react'

import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { upperCase } from 'lodash-es'
import pluralize from 'pluralize'

import { navigate, routes } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import FormContainer from 'src/components/utils/FormContainer'
import { useDisplayError } from 'src/components/utils/SnackBar'
import { useApp } from 'src/lib/AppContext'
import { UserFields } from 'src/lib/FieldSchemas'

export const QUERY = gql`
  query EditUser($id: Int!) {
    user: user(id: $id) {
      id
      email
      name
      expiresAt
      role
      custom_fields
      arrest_date_max
      arrest_date_min
      action_ids
      actions {
        id
        name
        start_date
      }
    }
  }
`

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: Int!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      email
      name
      expiresAt
      arrest_date_max
      arrest_date_min
      role
      action_ids
      custom_fields
    }
  }
`

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      email
      name
      expiresAt
      arrest_date_max
      arrest_date_min
      role
      action_ids
      custom_fields
    }
  }
`

export const DELETE_USER_MUTATION = gql`
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

const restrictionDefaults = {
  default: {
    arrest_date_min: ['subtract', 1, 'week'],
    expiresAt: ['add', 1, 'day', 'endOf'],
  },
  Admin: {
    arrest_date_min: ['subtract', 6, 'month'],
    expiresAt: ['add', 6, 'month', 'endOf'],
  },
}

const UserPage = ({ id }) => {
  const displayError = useDisplayError()
  const { setPageTitle } = useApp()
  const { currentUser } = useAuth()
  const {
    data = {},
    loading,
    error,
  } = useQuery(QUERY, {
    variables: { id: parseInt(id) },
    skip: !id || id === 'new',
    fetchPolicy: 'no-cache',
    onError: displayError,
  })
  const user = { ...data?.user }

  useEffect(() => {
    setPageTitle(user?.name)
  }, [user?.name, setPageTitle])

  const applyDateOperation = (
    date,
    [operation, amount, unit, modifier = '']
  ) => {
    date = date[operation](amount, unit)
    if (modifier) {
      date = date[modifier]('day')
    }
    return date
  }

  const applyDefaults = (role, target) => {
    const defaults = restrictionDefaults[role === 'Admin' ? 'Admin' : 'default']
    Object.entries(defaults).forEach(([field, operations]) => {
      const value = applyDateOperation(dayjs(), operations)
      if (target.setValue) {
        target.setValue(field, value)
      } else {
        target[field] = value
      }
    })
  }

  if (!id) {
    user.role = 'User'
    applyDefaults('User', user)
  }

  const formatDefaultValue = ([operator, amount, unit]) =>
    `${operator == 'add' ? '+' : '-'}${amount} ${pluralize(unit, amount)}`

  const tooltip = (
    <Box>
      {Object.entries(restrictionDefaults).map(([role, values]) => {
        return (
          <Box key={role}>
            <Typography variant="subtitle2">{upperCase(role)}:</Typography>
            <Box pl={2}>
              <Typography>
                Arrest min: {formatDefaultValue(values.arrest_date_min)} from
                now
              </Typography>
              <Typography>
                Expires: {formatDefaultValue(values.expiresAt)} from now
              </Typography>
            </Box>
          </Box>
        )
      })}
    </Box>
  )

  UserFields.forEach((section) => {
    if (section.title === 'Restrict Access') {
      section.fields.forEach((field) => {
        field[1].disabled = currentUser.id === id
      })
      section.sectionActions = [
        {
          label: 'Update Restrictions to Defaults',
          onClick: (_e, context) => {
            const role = context.getValues('role')
            applyDefaults(role, context)
          },
          tooltip,
        },
      ]
    }
    section.fields.forEach((field) => {
      if (field[0] === 'role') {
        field[1].onChange = (value, context) => {
          applyDefaults(value, context)
        }
      }
    })
  })
  if (error) return null

  return (
    <>
      <FormContainer
        fields={UserFields}
        entity={user}
        displayConfig={{
          type: 'User',
          name: user?.name,
        }}
        loading={loading}
        fetchQuery={QUERY}
        columnCount={1}
        createMutation={CREATE_USER_MUTATION}
        updateMutation={UPDATE_USER_MUTATION}
        deleteMutation={DELETE_USER_MUTATION}
        transformInput={transformInput}
        onDelete={() => navigate(routes.users())}
        onCreate={(data) => navigate(routes.user({ id: data.createUser.id }))}
      />
    </>
  )
}

export default UserPage
