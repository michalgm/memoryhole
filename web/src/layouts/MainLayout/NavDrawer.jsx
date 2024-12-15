import { useEffect, useState } from 'react'

import {
  DarkMode,
  EditNote,
  Error,
  Flag,
  Help,
  LightMode,
  Logout,
  ManageAccounts,
  People,
  SettingsBrightness,
} from '@mui/icons-material'
import {
  Collapse,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  useColorScheme,
} from '@mui/material'
import Box from '@mui/material/Box'
import { Stack } from '@mui/system'
import dayjs from 'dayjs'
import { useConfirm } from 'material-ui-confirm'

import { Link, routes, useMatch } from '@redwoodjs/router'

import { useAuth } from 'src/auth'

import { LEFT_DRAWER_WIDTH, LEFT_DRAWER_WIDTH_SMALL } from './MainLayout'
const NavDrawer = ({ navOpen }) => {
  const { currentUser, logOut } = useAuth()
  const { mode, setMode } = useColorScheme()

  const [expires, setExpires] = useState({})
  const [isHovered, setIsHovered] = useState(false)
  const confirm = useConfirm()

  const effectiveNavOpen = isHovered || navOpen

  const handleMouseEnter = () => {
    if (!navOpen) {
      setIsHovered(true)
    }
  }

  const handleMouseLeave = () => {
    if (!navOpen) {
      setIsHovered(false)
    }
  }

  const pages = [
    ['arrests', 'Arrests', <People key="arrests" />],
    ['actions', 'Actions', <Flag key="actions" />],
    ['logs', 'Logs', <EditNote key="logs" />],
    ['docsHome', 'Help', <Help key="help" />],
  ]
  const themeModes = [
    ['light', LightMode],
    ['system', SettingsBrightness],
    ['dark', DarkMode],
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
  const width = effectiveNavOpen ? LEFT_DRAWER_WIDTH : LEFT_DRAWER_WIDTH_SMALL

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open={effectiveNavOpen}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={(theme) => ({
        width: navOpen ? width : LEFT_DRAWER_WIDTH_SMALL,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        '& .MuiTypography-root': {
          whiteSpace: 'nowrap',
        },
        '& .MuiDrawer-paper': {
          width,
          marginTop: '48px',
          height: 'calc(100vh - 48px)',
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      })}
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <List sx={{ flexGrow: 1 }}>
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
        <List>
          <ListItem>
            <ListItemText sx={{ textAlign: 'center' }}>
              <ToggleButtonGroup
                value={mode}
                exclusive
                onChange={(_, value) => value && setMode(value)}
                size="x-small"
                sx={{
                  '& .MuiToggleButton-root': {
                    borderRadius: effectiveNavOpen ? undefined : 1,
                    mx: effectiveNavOpen ? undefined : 0,
                    borderColor: effectiveNavOpen
                      ? undefined
                      : 'var(--mui-palette-divider)',
                  },
                }}
              >
                {themeModes.map(([value, Icon]) => (
                  <Collapse
                    orientation="horizontal"
                    key={value}
                    in={effectiveNavOpen || value == mode}
                    value={value}
                  >
                    <Tooltip
                      title={`Set theme to ${value === 'system' ? 'system default' : `${value} mode`}`}
                    >
                      <ToggleButton key={value} value={value}>
                        <Icon size="inherit" />
                      </ToggleButton>
                    </Tooltip>
                  </Collapse>
                ))}
              </ToggleButtonGroup>
            </ListItemText>
          </ListItem>
        </List>
      </Box>
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
        component={to !== 'FAKE_ROUTE' ? Link : 'div'}
        to={route ? to : undefined}
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

export default NavDrawer
