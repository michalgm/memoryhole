import UserForm from 'src/components/User/UserForm/UserForm'
export const QUERY = gql`
  query EditUser($id: Int!) {
    user: user(id: $id) {
      id
      email
      name
      expiresAt
      role
      custom_fields
      arrest_date_max
      arrest_date_min
      action_ids
      actions {
        id
        name
        start_date
      }
    }
  }
`

export const Success = ({ user, onSave, loading, error }) => {
  return (
    <div>
      <UserForm user={user} onSave={onSave} loading={loading} error={error} />
    </div>
  )
}
