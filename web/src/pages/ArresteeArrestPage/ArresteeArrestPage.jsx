import { navigate, routes } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

import ArresteeLogsDrawer from 'src/components/ArresteeLogs/ArresteeLogsDrawer'
import FormContainer from 'src/components/utils/FormContainer'
import { useDisplayError } from 'src/components/utils/SnackBar'
import { useApp } from 'src/lib/AppContext'
import ArrestFields from 'src/lib/FieldSchemas'

export const QUERY = gql`
  query EditArresteeArrestById($id: Int!) {
    arresteeArrest: arrest(id: $id) {
      id
      date
      location
      display_field
      search_field
      date
      charges
      arrest_city
      jurisdiction
      citation_number
      arrestee_id
      action_id
      action {
        id
        name
        start_date
      }
      custom_fields
      created_at
      created_by {
        name
      }
      updated_at
      updated_by {
        name
      }
      arrestee {
        id
        display_field
        first_name
        last_name
        preferred_name
        pronoun
        dob
        email
        phone_1
        phone_2
        address
        city
        state
        zip
        custom_fields
        # logs {
        #   id
        #   time
        #   type
        #   notes
        #   needs_followup

        # }
        arrests {
          id
        }
      }
    }
  }
`

const UPDATE_ARREST_MUTATION = gql`
  mutation UpdateArresteeArrestMutation($id: Int!, $input: UpdateArrestInput!) {
    updateArrest(id: $id, input: $input) {
      id
      date
      location
      date
      charges
      arrest_city
      jurisdiction
      citation_number
      arrestee_id
      action_id
      custom_fields
      arrestee {
        id
        first_name
        last_name
        preferred_name
        pronoun
        dob
        email
        phone_1
        phone_2
        address
        city
        state
        zip
        custom_fields
        arrests {
          id
        }
      }
    }
  }
`

const CREATE_ARREST_MUTATION = gql`
  mutation CreateArresteeArrestMutation($input: CreateArrestInput!) {
    createArrest(input: $input) {
      id
      arrestee {
        id
      }
    }
  }
`

export const DELETE_ARREST_MUTATION = gql`
  mutation deleteArrestee($id: Int!) {
    deleteArrestee(id: $id) {
      id
    }
  }
`

const ArresteeArrestPage = ({ id }) => {
  const { currentAction } = useApp()
  const displayError = useDisplayError()
  const isCreate = !id || id === 'new'

  const {
    data: { arresteeArrest: arrest = { arrestee: {} } } = {},
    loading,
    error,
  } = useQuery(QUERY, {
    variables: { id: parseInt(id) },
    skip: isCreate,
    onError: displayError,
  })

  if (
    isCreate &&
    currentAction &&
    currentAction.id != -1 &&
    arrest &&
    !arrest?.action
  ) {
    arrest.action = currentAction
    if (currentAction.city) {
      arrest.arrest_city = currentAction.city
    }
    if (currentAction.jurisdiction) {
      arrest.jurisdiction = currentAction.jurisdiction
    }
  }

  const transformInput = (input) => {
    ;[
      'updated_at',
      'updated_by',
      'created_by',
      'created_at',
      'search_field',
      'display_field',
      'id',
    ].forEach((k) => delete input[k])
    if (!input.date) {
      delete input.date
    }
    if (input.action?.id) {
      input.action_id = input.action.id
    }
    delete input.action
    return input
  }

  if (error) return null

  return (
    <>
      <FormContainer
        fields={ArrestFields}
        entity={arrest}
        displayConfig={{
          type: 'Arrest',
          name: arrest?.arrestee?.display_field,
        }}
        loading={loading}
        fetchQuery={QUERY}
        createMutation={CREATE_ARREST_MUTATION}
        updateMutation={UPDATE_ARREST_MUTATION}
        deleteMutation={DELETE_ARREST_MUTATION}
        transformInput={transformInput}
        onDelete={() => navigate(routes.arrests())}
        onCreate={(data) =>
          navigate(routes.arrest({ id: data.createArrest.id }))
        }
      />
      {arrest?.arrestee?.id && (
        <ArresteeLogsDrawer arrestee_id={arrest?.arrestee?.id} />
      )}
    </>
  )
}

export default ArresteeArrestPage
