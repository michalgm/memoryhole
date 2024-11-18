import { Flag, People } from '@mui/icons-material'
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

  const route_links = [
    {
      to: routes.users(),
      label: 'Manage Users',
      icon: <People />,
    },
    {
      to: routes.actions(),
      label: 'Manage Actions',
      icon: <Flag />,
    },
  ]
  return (
    <>
      <MetaTags title="Admin" description="Admin page" />
      {/* <h1>Memoryhole Admin Page</h1> */}
      <List dense>
        {route_links.map((route) => (
          <Link key={route.to} to={route.to}>
            <ListItemButton>
              <ListItemIcon>{route.icon}</ListItemIcon>
              <ListItemText primary={route.label} />
            </ListItemButton>
          </Link>
        ))}
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
