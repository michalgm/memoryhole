import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ArresteeForm from 'src/components/Arrestee/ArresteeForm'

export const QUERY = gql`
  query EditArresteeById($id: Int!) {
    arrestee: arrestee(id: $id) {
      id
      display_field
      search_field
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
      notes
      custom_fields
      created_at
      created_by_id
      updated_at
      updated_by_id
    }
  }
`
const UPDATE_ARRESTEE_MUTATION = gql`
  mutation UpdateArresteeMutation($id: Int!, $input: UpdateArresteeInput!) {
    updateArrestee(id: $id, input: $input) {
      id
      display_field
      search_field
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
      notes
      custom_fields
      created_at
      created_by_id
      updated_at
      updated_by_id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ arrestee }) => {
  const [updateArrestee, { loading, error }] = useMutation(
    UPDATE_ARRESTEE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Arrestee updated')
        navigate(routes.arrestees())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input, id) => {
    updateArrestee({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Arrestee {arrestee?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <ArresteeForm
          arrestee={arrestee}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
