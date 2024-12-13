import { useCallback } from 'react'

import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { upperCase } from 'lodash-es'
import pluralize from 'pluralize'

import { navigate, routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import FormContainer from 'src/components/utils/FormContainer'
import { useApp } from 'src/lib/AppContext'
import { UserFields } from 'src/lib/FieldSchemas'

const USER_FIELDS = gql`
  fragment UserFields on User {
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
`

export const QUERY = gql`
  query EditUser($id: Int!) {
    user: user(id: $id) {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: Int!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ...UserFields
    }
  }
  ${USER_FIELDS}
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

const applyDateOperation = (date, [operation, amount, unit, modifier = '']) => {
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

const UserPage = ({ id }) => {
  const { setPageTitle } = useApp()
  const { currentUser } = useAuth()

  const isCreate = !id || id === 'new'

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

  const onFetch = useCallback(
    (user) => {
      setPageTitle(isCreate ? 'New User' : user?.name)
      if (isCreate) {
        user.role = 'User'
        applyDefaults(user.role, user)
      }
      return user
    },
    [setPageTitle, isCreate]
  )

  const onDelete = useCallback(() => {
    navigate(routes.users())
  }, [])

  const onCreate = useCallback((data) => {
    navigate(routes.user({ id: data.id }))
  }, [])

  return (
    <>
      <FormContainer
        fields={UserFields}
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
