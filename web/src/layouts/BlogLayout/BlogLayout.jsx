import * as React from 'react'

import PersonIcon from '@mui/icons-material/Person'
import { Container, Tooltip } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import { Link, routes, useMatch, useRouteName } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import QuickSearch from 'src/components/utils/QuickSearch'

import { theme } from '../../App'

const NavLink = ({ to, ...rest }) => {
  const matchInfo = useMatch(to, { matchSubPaths: true })
  const isActive = matchInfo.match

  const underline = {
    textDecoration: 'underline',
    textDecorationColor: theme.palette.secondary.main,
    textDecorationThickness: 3,
  }

  const props = {
    color: 'inherit',
    sx: {
      '&:hover': underline,
      ...(isActive && underline),
    },
  }

  return <Button component={Link} to={to} {...rest} {...props} />
}

const BlogLayout = ({ children }) => {
  const { isAuthenticated, currentUser, logOut } = useAuth()
  const routeName = useRouteName()

  const pages = [
    ['home', 'Arrests'],
    ['hotlineLogs', 'Hotline Logs'],
    ['docketSheets', 'Docket Sheets'],
  ]
  if (currentUser && currentUser.roles.includes('Admin')) {
    pages.push(['admin', 'Admin'])
  }
  return (
    <>
      <header>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="fixed" enableColorOnDark>
            <Toolbar className="navbar">
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="/"
                sx={{
                  color: 'white',
                  mr: 2,
                  flexGrow: 0,
                  fontFamily: 'monospace',
                  textDecoration: 'none',
                }}
              >
                memoryhole
              </Typography>
              <Box sx={{ flexGrow: 2 }}>
                {pages.map(([route, label]) => (
                  <NavLink key={route} to={routes[route]()}>
                    {label}
                  </NavLink>
                ))}
              </Box>
              <QuickSearch />
              {isAuthenticated && currentUser && (
                <>
                  <Tooltip title={`Logged in as ${currentUser.name}`}>
                    <PersonIcon />
                  </Tooltip>
                  <Button color="inherit" onClick={logOut}>
                    Logout
                  </Button>
                </>
              )}
            </Toolbar>
          </AppBar>
        </Box>
      </header>
      <Box component="main" sx={{ p: 3, mt: 8 }}>
        <Container maxWidth={routeName === 'home' ? false : 'lg'}>
          {children}
        </Container>
      </Box>
    </>
  )
}

export default BlogLayout
