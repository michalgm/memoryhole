import { navigate, routes } from '@redwoodjs/router'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ArrestForm from 'src/components/Arrest/ArrestForm'

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
      createdAt
      createdby_id
      updatedAt
      updatedby_id
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
      createdAt
      createdby_id
      updatedAt
      updatedby_id
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
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Arrest {arrest?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
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
