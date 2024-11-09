import { MetaTags } from '@redwoodjs/web'

import UserCell from 'src/components/User/UserCell/UserCell'

const UserPage = ({ id }) => {
  return (
    <>
      <MetaTags title="Edit User" description="Edit User" />
      <UserCell id={parseInt(id)} />
    </>
  )
}

export default UserPage
