import { navigate, routes } from '@redwoodjs/router'
import { MetaTags, useMutation } from '@redwoodjs/web'

import ArresteeArrestCell from 'src/components/ArresteeArrestCell'
import { QUERY } from 'src/components/ArresteeArrestCell'
import ArresteeArrestForm from 'src/components/ArresteeArrestForm/ArresteeArrestForm'
import { useDisplayError, useSnackbar } from 'src/components/utils/SnackBar'

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

const ArresteeArrestPage = ({ id }) => {
  const { openSnackbar } = useSnackbar()
  const displayError = useDisplayError()

  const [createArrest, { loadingCreate, errorCreate }] = useMutation(
    CREATE_ARREST_MUTATION,
    {
      onCompleted: (data) => {
        openSnackbar('Arrest created')
        navigate(routes.arrest({ id: data.createArrest.id }))
      },
      onError: displayError,
    }
  )

  const [updateArrest, { loading, error }] = useMutation(
    UPDATE_ARREST_MUTATION,
    {
      onCompleted: async () => {
        openSnackbar('Arrest updated')
      },
      refetchQueries: [{ query: QUERY, variables: { id } }],
      awaitRefetchQueries: true,
      onError: displayError,
    }
  )

  const onSave = async (input, id) => {
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
    if (id) {
      return updateArrest({ variables: { id, input } })
    } else {
      return createArrest({ variables: { input } })
    }
  }

  return (
    <>
      <MetaTags title="Arrest" description="Arrest page" />
      {id && id !== 'new' ? (
        <ArresteeArrestCell
          id={id}
          onSave={onSave}
          loading={loading || loadingCreate}
          error={error || errorCreate}
        />
      ) : (
        <ArresteeArrestForm
          onSave={onSave}
          loading={loading || loadingCreate}
          error={error || errorCreate}
        />
      )}
    </>
  )
}

export default ArresteeArrestPage
