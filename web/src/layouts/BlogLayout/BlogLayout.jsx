import { useCallback } from 'react'

import { Flag, Help, Person } from '@mui/icons-material'
import { Container, IconButton, InputAdornment, Tooltip } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Stack } from '@mui/system'

import { Link, routes, useMatch, useRouteName } from '@redwoodjs/router'

import { theme } from 'src/App'
import { useAuth } from 'src/auth'
// import ArresteeLogsDrawer from 'src/components/ArresteeLogs/ArresteeLogsDrawer'
import { BaseField } from 'src/components/utils/BaseField'
import QuickSearch from 'src/components/utils/QuickSearch'
import AppProvider, { defaultAction, useApp } from 'src/lib/AppContext'

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

const textFieldProps = {
  variant: 'standard',
  InputProps: {
    // sx: {
    //   minWidth: 200,
    // },
    disableUnderline: true,
    startAdornment: (
      <InputAdornment position="start">
        <Flag />
      </InputAdornment>
    ),
  },
  sx: {
    borderRadius: 1,
    backgroundColor: 'primary.light',
    input: { color: '#fff' }, // Text color for readability
    '& .MuiSvgIcon-root, & .MuiCircularProgress-root ': {
      color: '#fff !important',
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
        borderColor: '#ffffff', // Border color on hover
        border: 'none',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#ffffff', // Border color when focused
        border: 'none',
      },
    },
  },
}

const NavBar = () => {
  const { currentUser, logOut } = useAuth()
  const { currentAction, setCurrentAction } = useApp()

  const pages = [
    ['home', 'Arrests'],
    ['actions', 'Actions'],
    ['hotlineLogs', 'Hotline Logs'],
  ]
  if (currentUser && currentUser.roles.includes('Admin')) {
    pages.push(['admin', 'Admin'])
  }

  const transformOptions = useCallback(
    (options) => [defaultAction, ...options],
    []
  )

  return (
    <header>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" enableColorOnDark>
          <Toolbar className="navbar" variant="dense">
            <Typography
              variant="h4"
              noWrap
              component={Link}
              to={routes.home()}
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
            <Stack
              direction="row"
              spacing={2}
              alignItems={'center'}
              alignContent={'center'}
              sx={{ flexGrow: 20, maxWidth: 600 }}
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
                <Tooltip title={`Logged in as ${currentUser.name}`}>
                  <Button
                    startIcon={<Person />}
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
const BlogLayout = ({ children }) => {
  const routeName = useRouteName()
  // const [logsOpen, setLogsOpen] = useState(false)
  // const DRAWER_WIDTH = 400

  return (
    <>
      <AppProvider>
        <NavBar />
        <Box component="main" sx={{ p: 3, mt: 6 }}>
          <Container
            id="container"
            maxWidth={routeName === 'home' ? false : 'lg'}
          >
            {children}
            {/* <Box
            sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
          >
            <Box
              sx={{
                display: 'flex',
                flex: 1,
                transition: 'margin 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
                marginRight: logsOpen ? `${DRAWER_WIDTH}px` : 0,
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  width: logsOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
                }}
              >
                {children}
              </Box>
              <ArresteeLogsDrawer
                open={logsOpen}
                setOpen={setLogsOpen}
                width={DRAWER_WIDTH}
              />
            </Box>
          </Box> */}
          </Container>
        </Box>
      </AppProvider>
    </>
  )
}

export default BlogLayout
