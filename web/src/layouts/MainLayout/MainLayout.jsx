import { useCallback, useEffect, useState } from 'react'

import {
  ChevronLeft,
  ChevronRight,
  EditNote,
  Error,
  Flag,
  Help,
  Logout,
  ManageAccounts,
  Menu,
  MenuOpen,
  People,
} from '@mui/icons-material'
import {
  Container,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { alpha, Stack, styled, useMediaQuery } from '@mui/system'
import dayjs from 'dayjs'
import { useConfirm } from 'material-ui-confirm'

import { Link, routes, useMatch, useRouteName } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import LogsDrawer from 'src/components/Logs/LogsDrawer'
import { BaseField } from 'src/components/utils/BaseField'
import QuickSearch from 'src/components/utils/QuickSearch'
import AppProvider, { defaultAction, useApp } from 'src/lib/AppContext'

const DRAWER_WIDTH = 450
const LEFT_DRAWER_WIDTH = 150
const LEFT_DRAWER_WIDTH_SMALL = 64

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

const NavBar = ({ navOpen, setNavOpen, setLogsOpen, logsOpen }) => {
  const { currentAction, setCurrentAction } = useApp()

  const transformOptions = useCallback(
    (options) => [defaultAction, ...options],
    []
  )
  return (
    <Box component="header" sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar className="navbar" variant="dense" sx={{ mx: '-12px' }}>
          <Stack
            direction="row"
            alignItems="center"
            sx={{ width: '100%' }}
            spacing={2}
          >
            <Tooltip title="Toggle Menu">
              <IconButton onClick={() => setNavOpen(!navOpen)} color="inherit">
                {navOpen ? <MenuOpen /> : <Menu />}
              </IconButton>
            </Tooltip>
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
                  flexGrow: 0,
                  fontFamily: 'monospace',
                  textDecoration: 'none',
                }}
              >
                memoryhole
              </Typography>
            </Tooltip>

            <Box sx={{ flexGrow: 7, maxWidth: '250px', ml: 'auto !important' }}>
              <QuickSearch />
            </Box>

            <Box sx={{ flexGrow: 5, maxWidth: '200px' }}>
              <BaseField
                name="action"
                color="inherit"
                field_type="action_chooser"
                label="Action"
                value={currentAction}
                onChange={setCurrentAction}
                disableClearable
                autoHighlight
                autoComplete
                placeholder="Type to search"
                transformOptions={transformOptions}
                textFieldProps={textFieldProps}
              />
            </Box>
            <Tooltip title="Toggle Logs Panel">
              <Button
                onClick={() => setLogsOpen(!logsOpen)}
                variant="contained"
                color="inherit"
                sx={{
                  color: 'var(--mui-palette-text-primary)',
                }}
                startIcon={logsOpen ? <ChevronRight /> : <ChevronLeft />}
                size="small"
              >
                Logs
              </Button>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

const Main = styled('main', {
  shouldForwardProp: (prop) => !['leftOpen', 'rightOpen'].includes(prop),
})(({ theme, leftOpen, rightOpen }) => {
  const small = useMediaQuery(theme.breakpoints.down('md'))
  const leftWidth = leftOpen ? LEFT_DRAWER_WIDTH : LEFT_DRAWER_WIDTH_SMALL
  return {
    flexGrow: 1,
    padding: theme.spacing(small ? 1 : 2),
    marginTop: '48px',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    // marginLeft: leftWidth,
    ...(rightOpen && {
      marginRight: DRAWER_WIDTH,
    }),
    width: `calc(100% - ${leftWidth + rightOpen ? DRAWER_WIDTH : 0}px)`,
  }
})

const NavDrawer = ({ navOpen }) => {
  const { currentUser, logOut } = useAuth()
  const [expires, setExpires] = useState({})
  const confirm = useConfirm()

  const pages = [
    ['arrests', 'Arrests', <People key="arrests" />],
    ['actions', 'Actions', <Flag key="actions" />],
    ['logs', 'Logs', <EditNote key="logs" />],
    ['docsHome', 'Help', <Help key="help" />],
  ]
  if (currentUser && currentUser.roles.includes('Admin')) {
    pages.push(['admin', 'Admin', <ManageAccounts key="admin" />])
  }

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

  const LogoutIcon =
    expires.expiring_soon && role !== 'User' ? (
      <Error color="error" />
    ) : (
      <Logout />
    )
  const width = navOpen ? LEFT_DRAWER_WIDTH : LEFT_DRAWER_WIDTH_SMALL

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open={navOpen}
      sx={(theme) => ({
        width,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        '& .MuiDrawer-paper': {
          width,
          marginTop: '48px',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      })}
    >
      <List>
        {pages.map(([route, label, Icon]) => (
          <NavMenuItem key={route} route={route} label={label} Icon={Icon} />
        ))}
        <Divider component={'li'} sx={{ m: 1 }} />
        <Tooltip
          title={
            <Stack>
              <span>Logged in as {currentUser.name}</span>
              {<span>{expires.expiring}</span>}
            </Stack>
          }
        >
          <span>
            <NavMenuItem
              onClick={async () => {
                await confirm({
                  title: 'Are you sure you want to sign out?',
                  confirmationText: 'Sign out',
                })
                if (confirm) {
                  logOut()
                }
              }}
              label="Sign out"
              Icon={LogoutIcon}
            />
          </span>
        </Tooltip>
      </List>
    </Drawer>
  )
}

const NavMenuItem = ({ route, label, Icon, ...props }) => {
  const to = route && routes[route] ? routes[route]() : 'FAKE_ROUTE'
  const matchInfo = useMatch(to, { matchSubPaths: true })
  const isActive = matchInfo.match
  return (
    <ListItem sx={{ px: 1, py: 0 }}>
      <ListItemButton
        selected={isActive}
        component={Link}
        to={route ? to : null}
        sx={{
          borderRadius: 2,
          px: 'calc(1.4* 8px)',
          height: '48px',
          '.MuiListItemIcon-root': {
            flexShrink: 0,
            display: 'inline-flex',
            minWidth: '34px',
            marginRight: 'calc(1.3* 8px)',
          },
          '&.Mui-selected': {
            '& .MuiListItemIcon-root': {
              color: 'primary.light',
            },
            '& .MuiListItemText-primary': {
              color: 'primary.light',
            },
          },
        }}
        {...props}
      >
        <ListItemIcon>{Icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  )
}

const Layout = ({ children }) => {
  const routeName = useRouteName()
  const { logsOpen, setLogsOpen, navOpen, setNavOpen } = useApp()

  return (
    <>
      <NavBar
        navOpen={navOpen}
        setNavOpen={setNavOpen}
        logsOpen={logsOpen}
        setLogsOpen={setLogsOpen}
      />
      <Box sx={{ display: 'flex' }}>
        <NavDrawer navOpen={navOpen} />
        <Main id="main-content" leftOpen={navOpen} rightOpen={logsOpen}>
          <Container
            id="container"
            sx={{
              maxWidth: routeName === 'home' ? false : 'lg',
              minWidth: '590px',
            }}
          >
            {children}
          </Container>
        </Main>
        <LogsDrawer
          open={logsOpen}
          setOpen={setLogsOpen}
          width={DRAWER_WIDTH}
        />
      </Box>
    </>
  )
}

const MainLayout = ({ children }) => {
  return (
    <AppProvider>
      <Layout>{children}</Layout>
    </AppProvider>
  )
}

export default MainLayout
