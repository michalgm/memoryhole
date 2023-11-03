import * as React from 'react'

import { Container, Tooltip } from '@mui/material'
import { NavLink, routes, useMatch } from '@redwoodjs/router'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import PersonIcon from '@mui/icons-material/Person'
import QuickSearch from 'src/components/utils/QuickSearch'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useAuth } from 'src/auth'

const CustomLink = ({ to, ...rest }) => {
  const matchInfo = useMatch(to)
  const isActive = matchInfo.match

  const props = {
    color: 'inherit',
    style: { textDecoration: 'none' },
  }
  if (isActive) {
    props.color = 'secondary'
    props.sx = {
    }
  }
  return <Button component={NavLink} to={to} {...rest} {...props} />
}

const BlogLayout = ({ children }) => {
  const { isAuthenticated, currentUser, logOut } = useAuth()
  const pages = ['home', 'about', 'admin']

  return (
    <>
      <header>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  flexGrow: 0,
                  fontFamily: 'monospace',
                  // fontWeight: 700,
                  letterSpacing: '-.0rem',
                  color: 'secondary.light',
                  textDecoration: 'none',
                }}
              >
                MemoryHole
              </Typography>
              <Box sx={{flexGrow: 2}}>
                {pages.map((page) => (
                  <CustomLink key={page} to={routes[page]()}>
                    {page}
                  </CustomLink>
                ))}
              </Box>
              <QuickSearch/>
              <Tooltip title={`Logged in as ${currentUser.name}foo`}>
                <PersonIcon />
              </Tooltip>
              <Button color="inherit" onClick={logOut}>
                Logout
              </Button>
            </Toolbar>
          </AppBar>
        </Box>
      </header>
      <main>
        <Container>{children}</Container>
      </main>
    </>
  )
}

export default BlogLayout
