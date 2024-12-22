import { Flag, Gavel, Help, People } from '@mui/icons-material'
import {
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'

import { routes } from '@redwoodjs/router'

import Link from 'src/components/utils/Link'

const AdminPage = () => {
  const admin_routes = [
    // 'users',
    // 'hotlineLogs',
    // 'customSchemata',
    'logs',
    'tableViews',
    // 'actions',
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
    {
      to: routes.docketSheets(),
      label: 'Create Docket Sheets',
      icon: <Gavel />,
    },
    {
      to: routes.editHelp(),
      label: 'Edit Site Help Page',
      icon: <Help />,
    },
  ]

  return (
    <>
      <List>
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

      <Divider />
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
