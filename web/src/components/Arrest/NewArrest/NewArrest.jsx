import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ArrestForm from 'src/components/Arrest/ArrestForm'

const CREATE_ARREST_MUTATION = gql`
  mutation CreateArrestMutation($input: CreateArrestInput!) {
    createArrest(input: $input) {
      id
    }
  }
`

const NewArrest = () => {
  const [createArrest, { loading, error }] = useMutation(
    CREATE_ARREST_MUTATION,
    {
      onCompleted: () => {
        toast.success('Arrest created')
        navigate(routes.arrests())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input) => {
    createArrest({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Arrest</h2>
      </header>
      <div className="rw-segment-main">
        <ArrestForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewArrest
