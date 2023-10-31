import { navigate, routes } from '@redwoodjs/router'

import ArrestForm from 'src/components/Arrest/ArrestForm'
import { toast } from '@redwoodjs/web/toast'
import { useMutation } from '@redwoodjs/web'

export const QUERY = gql`
  query EditArrestById($id: Int!) {
    arrest: arrest(id: $id) {
      id
      display_field
      search_field
      date
      location
      charges
      arrest_city
      jurisdiction
      citation_number
      arrestee_id
      custom_fields
      created_at
      created_by_id
      updated_at
      updated_by_id
    }
  }
`
const UPDATE_ARREST_MUTATION = gql`
  mutation UpdateArrestMutation($id: Int!, $input: UpdateArrestInput!) {
    updateArrest(id: $id, input: $input) {
      id
      display_field
      search_field
      date
      location
      charges
      arrest_city
      jurisdiction
      citation_number
      arrestee_id
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

export const Success = ({ arrest }) => {
  const [updateArrest, { loading, error }] = useMutation(
    UPDATE_ARREST_MUTATION,
    {
      onCompleted: () => {
        toast.success('Arrest updated')
        navigate(routes.arrests())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input, id) => {
    updateArrest({ variables: { id, input } })
  }

  return (
    <div>
      <header>
        <h2>
          Edit Arrest {arrest?.id}
        </h2>
      </header>
      <div>
        <ArrestForm
          arrest={arrest}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
