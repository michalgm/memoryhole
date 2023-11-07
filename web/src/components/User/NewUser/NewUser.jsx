import { navigate, routes } from '@redwoodjs/router'

import UserForm from 'src/components/User/UserForm'
import { toast } from '@redwoodjs/web/toast'
import { useAuth } from 'src/auth'
import { useMutation } from '@redwoodjs/web'

const CREATE_USER_MUTATION = gql`
  mutation CreateUserMutation($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
    }
  }
`

const NewUser = () => {
  const { isAuthenticated, forgotPassword } = useAuth()

  const [createUser, { loading, error }] = useMutation(CREATE_USER_MUTATION, {
    onCompleted: async ({ createUser: user }) => {
      console.log(user)
      await forgotPassword(user.email)
      toast.success('User created')
      // navigate(routes.users())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input) => {
    createUser({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New User</h2>
      </header>
      <div className="rw-segment-main">
        <UserForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewUser
