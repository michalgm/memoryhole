import { Link, routes } from '@redwoodjs/router'

import { MetaTags } from '@redwoodjs/web'

const AdminPage = () => {
  const admin_routes = ['arrests', 'users', 'arrestees', 'hotlineLogs', 'customSchemata','logs']
  console.log(routes)
  return (
    <>
      <MetaTags title="Admin" description="Admin page" />

      <h1>AdminPage</h1>
      <Link to={routes.editOptions()}>Edit Options</Link>

      <ul>
        {admin_routes.map((route) => (
          <li key={route}>
            <Link to={routes[route]()}>{route}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default AdminPage
