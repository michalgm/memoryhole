import * as React from 'react'

import { Container, Tooltip } from '@mui/material'
import { NavLink, routes, useMatch, useRouteName } from '@redwoodjs/router'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import PersonIcon from '@mui/icons-material/Person'
import QuickSearch from 'src/components/utils/QuickSearch'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { theme } from '../../App'
import { useAuth } from 'src/auth'

const CustomLink = ({ to, ...rest }) => {
  const matchInfo = useMatch(to)
  const isActive = matchInfo.match

  const props = {
    color: 'inherit',
  }
  if (isActive) {
    // props.color = 'secondary'
    props.sx = {
      textDecoration: 'underline',
      textDecorationColor: theme.palette.secondary.main,
      textDecorationThickness: 3,
    }
  }
  return <Button component={NavLink} to={to} {...rest} {...props} />
}

const BlogLayout = ({ children }) => {
  const { isAuthenticated, currentUser, logOut } = useAuth()
  const routeName = useRouteName()

  const pages = [
    ['home', 'Arrests'],
    ['hotlineLogs', 'Hotline Logs'],
    ['docketSheets', 'Docket Sheets'],
  ]
  if (currentUser && currentUser) {
    pages.push(['admin', 'Admin'])
  }
  return (
    <>
      <header>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" enableColorOnDark>
            <Toolbar>
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
                  <CustomLink key={route} to={routes[route]()}>
                    {label}
                  </CustomLink>
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
      <Box component="main" sx={{ p: 3 }}>
        <Container maxWidth={routeName === 'home'? false : 'lg'}>{children}</Container>
      </Box>
    </>
  )
}

export default BlogLayout
