import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ArresteeForm from 'src/components/Arrestee/ArresteeForm'

const CREATE_ARRESTEE_MUTATION = gql`
  mutation CreateArresteeMutation($input: CreateArresteeInput!) {
    createArrestee(input: $input) {
      id
    }
  }
`

const NewArrestee = () => {
  const [createArrestee, { loading, error }] = useMutation(
    CREATE_ARRESTEE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Arrestee created')
        navigate(routes.arrestees())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input) => {
    createArrestee({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Arrestee</h2>
      </header>
      <div className="rw-segment-main">
        <ArresteeForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewArrestee
