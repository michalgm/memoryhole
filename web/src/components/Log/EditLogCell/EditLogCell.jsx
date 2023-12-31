import { navigate, routes } from '@redwoodjs/router'

import LogForm from 'src/components/Log/LogForm'
import { toast } from '@redwoodjs/web/toast'
import { useMutation } from '@redwoodjs/web'

export const QUERY = gql`
  query EditLogById($id: Int!) {
    log: log(id: $id) {
      id
      time
      type
      notes
      needs_followup
      custom_fields
      arrestee_id
      created_at
      created_by_id
      updated_at
      updated_by_id
    }
  }
`
const UPDATE_LOG_MUTATION = gql`
  mutation UpdateLogMutation($id: Int!, $input: UpdateLogInput!) {
    updateLog(id: $id, input: $input) {
      id
      time
      type
      notes
      needs_followup
      custom_fields
      arrestee_id
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

export const Success = ({ log }) => {
  const [updateLog, { loading, error }] = useMutation(UPDATE_LOG_MUTATION, {
    onCompleted: () => {
      toast.success('Log updated')
      navigate(routes.logs())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input, id) => {
    updateLog({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">Edit Log {log?.id}</h2>
      </header>
      <div className="rw-segment-main">
        <LogForm log={log} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  )
}
