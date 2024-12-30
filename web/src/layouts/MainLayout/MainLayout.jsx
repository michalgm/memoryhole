import { useEffect, useState } from 'react'

import { Box, Container } from '@mui/material'
import { styled } from '@mui/material/styles'
import isHotkey from 'is-hotkey'

import { navigate, routes, useRouteName } from '@redwoodjs/router'

import LogsDrawer from 'src/components/Logs/LogsDrawer'
import AppProvider, {
  HEADER_HEIGHT,
  LEFT_DRAWER_WIDTH,
  LEFT_DRAWER_WIDTH_SMALL,
  RIGHT_DRAWER_WIDTH,
  useApp,
} from 'src/lib/AppContext'

import NavBar from './NavBar'
import NavDrawer from './NavDrawer'

const Main = styled('main', {
  shouldForwardProp: (prop) => !['leftOpen', 'rightOpen'].includes(prop),
})(({ theme, leftOpen, rightOpen }) => {
  const leftWidth = leftOpen ? LEFT_DRAWER_WIDTH : LEFT_DRAWER_WIDTH_SMALL
  return {
    '--header-height': `${HEADER_HEIGHT}px`,
    flexGrow: 1,
    marginTop: 0,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    // marginLeft: leftWidth,
    ...(rightOpen && {
      marginRight: RIGHT_DRAWER_WIDTH,
    }),
    width: `calc(100% - ${leftWidth + (rightOpen ? RIGHT_DRAWER_WIDTH : 0)}px)`,
    overflowX: 'auto',
    overflowY: 'auto',
    display: 'block',
    height: 'calc(100vh - var(--header-height))',
  }
})

const Layout = ({ children }) => {
  const routeName = useRouteName()
  const { logsOpen, setLogsOpen, navOpen, setNavOpen } = useApp()
  const [newLogRequested, setNewLogRequested] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isHotkey('alt+l', e)) {
        e.preventDefault()
        setLogsOpen(true)
        setNavOpen(false)
        setNewLogRequested(true)
      }
      if (isHotkey('alt+a', e)) {
        e.preventDefault()
        navigate(routes['newArrest']())
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [setLogsOpen, setNavOpen])

  return (
    <>
      <NavBar
        navOpen={navOpen}
        setNavOpen={setNavOpen}
        logsOpen={logsOpen}
        setLogsOpen={setLogsOpen}
        height={HEADER_HEIGHT}
      />
      <Box sx={{ display: 'flex' }}>
        <NavDrawer navOpen={navOpen} />
        <Main id="main-content" leftOpen={navOpen} rightOpen={logsOpen}>
          <Container
            id="container"
            sx={{
              maxWidth: routeName === 'home' ? false : 'lg',
              minWidth: '300px',
              p: 0,
            }}
          >
            {children}
          </Container>
        </Main>
        <LogsDrawer
          open={logsOpen}
          width={RIGHT_DRAWER_WIDTH}
          newLogRequested={newLogRequested}
          onNewLogComplete={() => setNewLogRequested(false)}
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
