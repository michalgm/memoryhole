import { Gavel, Help, ListAlt, People, Settings } from '@mui/icons-material'
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material'

import { routes } from '@redwoodjs/router'

import Link from 'src/components/utils/Link'

const AdminPage = () => {
  const route_links = [
    {
      to: routes.users(),
      label: 'Manage Users',
      icon: <People />,
    },
    {
      to: routes.settings(),
      label: 'Edit Site Settings',
      icon: <Settings />,
    },
    {
      to: routes.editOptions(),
      label: 'Edit Option Lists',
      icon: <ListAlt />,
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
    <Paper>
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
    </Paper>
  )
}

export default AdminPage
