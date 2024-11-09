import { navigate, routes } from '@redwoodjs/router'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ActionForm from 'src/components/Action/ActionForm'

export const QUERY = gql`
  query EditActionById($id: Int!) {
    action: action(id: $id) {
      id
      name
      description
      start_date
      end_date
      jurisdiction
      city
      custom_fields
    }
  }
`

const UPDATE_ACTION_MUTATION = gql`
  mutation UpdateActionMutation($id: Int!, $input: UpdateActionInput!) {
    updateAction(id: $id, input: $input) {
      id
      name
      description
      start_date
      end_date
      jurisdiction
      city
      custom_fields
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ action }) => {
  const [updateAction, { loading, error }] = useMutation(
    UPDATE_ACTION_MUTATION,
    {
      onCompleted: () => {
        toast.success('Action updated')
        navigate(routes.actions())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input, id) => {
    updateAction({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Action {action?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <ActionForm
          action={action}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
