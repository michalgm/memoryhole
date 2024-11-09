import { People } from '@mui/icons-material'
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'

import { routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import Link from 'src/components/utils/Link'

const AdminPage = () => {
  const admin_routes = [
    'arrests',
    'users',
    'arrestees',
    // 'hotlineLogs',
    'customSchemata',
    'logs',
    'tableViews',
    'actions',
  ]
  return (
    <>
      <MetaTags title="Admin" description="Admin page" />
      <h1>Memoryhole Admin Page</h1>
      <List>
        <Link to={routes.users()}>
          <ListItemButton>
            <ListItemIcon>
              <People />
            </ListItemIcon>
            <ListItemText primary={'Manage Users'} />
          </ListItemButton>
        </Link>
      </List>
      {/* <Link to={routes.editOptions()}>Edit Options</Link> */}

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
