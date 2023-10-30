import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import HotlineLogForm from 'src/components/HotlineLog/HotlineLogForm'

const CREATE_HOTLINE_LOG_MUTATION = gql`
  mutation CreateHotlineLogMutation($input: CreateHotlineLogInput!) {
    createHotlineLog(input: $input) {
      id
    }
  }
`

const NewHotlineLog = () => {
  const [createHotlineLog, { loading, error }] = useMutation(
    CREATE_HOTLINE_LOG_MUTATION,
    {
      onCompleted: () => {
        toast.success('HotlineLog created')
        navigate(routes.hotlineLogs())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input) => {
    createHotlineLog({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New HotlineLog</h2>
      </header>
      <div className="rw-segment-main">
        <HotlineLogForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewHotlineLog
