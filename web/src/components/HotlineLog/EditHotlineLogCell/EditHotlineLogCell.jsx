import { navigate, routes } from '@redwoodjs/router'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import HotlineLogForm from 'src/components/HotlineLog/HotlineLogForm'

export const QUERY = gql`
  query EditHotlineLogById($id: Int!) {
    hotlineLog: hotlineLog(id: $id) {
      id
      time
      type
      notes
      custom_fields
      createdAt
      createdby_id
      updatedAt
      updatedby_id
    }
  }
`
const UPDATE_HOTLINE_LOG_MUTATION = gql`
  mutation UpdateHotlineLogMutation($id: Int!, $input: UpdateHotlineLogInput!) {
    updateHotlineLog(id: $id, input: $input) {
      id
      time
      type
      notes
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

export const Success = ({ hotlineLog }) => {
  const [updateHotlineLog, { loading, error }] = useMutation(
    UPDATE_HOTLINE_LOG_MUTATION,
    {
      onCompleted: () => {
        toast.success('HotlineLog updated')
        navigate(routes.hotlineLogs())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input, id) => {
    updateHotlineLog({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit HotlineLog {hotlineLog?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <HotlineLogForm
          hotlineLog={hotlineLog}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
