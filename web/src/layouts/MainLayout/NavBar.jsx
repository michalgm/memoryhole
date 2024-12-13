import { useCallback, useEffect, useState } from 'react'

import { useTheme } from '@emotion/react'
import { Error, Flag, Help, Person } from '@mui/icons-material'
import {
  AppBar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { alpha, Stack } from '@mui/system'
import dayjs from 'dayjs'

import { Link, routes, useMatch } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import { BaseField } from 'src/components/utils/BaseField'
import QuickSearch from 'src/components/utils/QuickSearch'
import { defaultAction, useApp } from 'src/lib/AppContext'

const textFieldProps = {
  variant: 'standard',
  InputProps: {
    sx: {
      color: 'contrast.main',
      '& .MuiButtonBase-root': {
        color: 'inherit',
        '.MuiSvgIcon-root': {
          color: 'inherit',
        },
      },
    },

    disableUnderline: true,
    startAdornment: (
      <InputAdornment
        sx={{
          color: 'inherit',
        }}
        position="start"
      >
        <Flag color="blue" />
      </InputAdornment>
    ),
  },
  sx: {
    borderRadius: 1,
    backgroundColor: (theme) => alpha(theme.palette.common.white, 0.2), //'primary.light',
    // input: { color: 'contrast.main' }, // Text color for readability
    '& .MuiSvgIcon-root, & .MuiCircularProgress-root ': {
      color: 'text.primary !important',
    },
    '& .MuiInputBase-input': {
      border: 'none',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#ccc', // Default border
        border: 'none',
      },
      '&:hover fieldset': {
        borderColor: 'text.primary', // Border color on hover
        border: 'none',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'text.primary', // Border color when focused
        border: 'none',
      },
    },
  },
}

const NavLink = ({ to, ...rest }) => {
  const matchInfo = useMatch(to, { matchSubPaths: true })
  const theme = useTheme()
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

const NavBar = () => {
  const { currentUser, logOut } = useAuth()
  const { currentAction, setCurrentAction } = useApp()
  const [expires, setExpires] = useState({})

  const pages = [
    ['home', 'Arrests'],
    ['actions', 'Actions'],
    ['logs', 'Logs'],
  ]
  if (currentUser && currentUser.roles.includes('Admin')) {
    pages.push(['admin', 'Admin'])
  }

  const transformOptions = useCallback(
    (options) => [defaultAction, ...options],
    []
  )
  const {
    expiresAt,
    roles: [role],
  } = currentUser

  useEffect(() => {
    if (expiresAt) {
      setExpires({
        expiring: `Your access will expire on ${dayjs(expiresAt).format('lll')}`,
        expiring_soon: dayjs(expiresAt).isBefore(dayjs().add(1, 'week')),
      })
    }
  }, [expiresAt, setExpires])

  return (
    <header>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar className="navbar" variant="dense">
            <Tooltip title={`Version: ${import.meta.env.APP_VERSION}`}>
              <Typography
                variant="h4"
                noWrap
                component={Link}
                to={routes.home()}
                sx={{
                  color: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'secondary.light'
                      : 'contrast.main',
                  mr: 2,
                  flexGrow: 0,
                  fontFamily: 'monospace',
                  textDecoration: 'none',
                }}
              >
                memoryhole
              </Typography>
            </Tooltip>
            <Box sx={{ flexGrow: 2 }}>
              {pages.map(([route, label]) => (
                <NavLink key={route} to={routes[route]()}>
                  {label}
                </NavLink>
              ))}
            </Box>
            <Stack
              direction="row"
              spacing={2}
              alignItems={'center'}
              alignContent={'center'}
              sx={{
                flexGrow: 20,
                maxWidth: 600,
                color: 'contrast.main',
              }}
            >
              <Box sx={{ flexGrow: 7 }}>
                <QuickSearch />
              </Box>
              <Box sx={{ flexGrow: 5 }}>
                <BaseField
                  name="action"
                  field_type="action_chooser"
                  label="Action"
                  value={currentAction}
                  onChange={setCurrentAction}
                  disableClearable
                  autoHighlight
                  autoComplete
                  placeholder="Type to search"
                  transformOptions={transformOptions}
                  // openOnFocus
                  // selectOnFocus={false}
                  textFieldProps={textFieldProps}
                />
              </Box>
              <Stack
                direction="row"
                alignItems={'center'}
                spacing={2}
                sx={{ ml: 'auto' }}
              >
                <Tooltip title="Help">
                  {/* <span>
                    <StyledLink
                      to={routes.docsHome()}
                      color="inherit"
                      sx={{ display: 'flex', alignItems: 'center', mx: 1 }}
                    > */}
                  <IconButton
                    component={Link}
                    to={routes.docsHome()}
                    color="inherit"
                  >
                    <Help />
                  </IconButton>
                  {/* </StyledLink>
                  </span> */}
                </Tooltip>
                <Tooltip
                  title={
                    <Stack>
                      <span>Logged in as {currentUser.name}</span>
                      {<span>{expires.expiring}</span>}
                    </Stack>
                  }
                >
                  <Button
                    startIcon={
                      expires.expiring_soon && role !== 'User' ? (
                        <Error color="error" />
                      ) : (
                        <Person />
                      )
                    }
                    color="inherit"
                    onClick={logOut}
                    sx={{
                      border: '1px solid rgba(255, 255, 255, 0.3)', // Subtle border
                      textTransform: 'none', // Keep text normal-case
                    }}
                  >
                    Logout
                  </Button>
                </Tooltip>
              </Stack>
            </Stack>
          </Toolbar>
        </AppBar>
      </Box>
    </header>
  )
}

export default NavBar
