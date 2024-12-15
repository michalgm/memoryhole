import { useEffect, useState } from 'react'

import { Container } from '@mui/material'
import Box from '@mui/material/Box'
import { styled, useMediaQuery } from '@mui/system'

import { useRouteName } from '@redwoodjs/router'

import LogsDrawer from 'src/components/Logs/LogsDrawer'
import AppProvider, { useApp } from 'src/lib/AppContext'

import NavBar from './NavBar'
import NavDrawer from './NavDrawer'

export const RIGHT_DRAWER_WIDTH = 450
export const LEFT_DRAWER_WIDTH = 150
export const LEFT_DRAWER_WIDTH_SMALL = 64

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
      marginRight: RIGHT_DRAWER_WIDTH,
    }),
    width: `calc(100% - ${leftWidth + (rightOpen ? RIGHT_DRAWER_WIDTH : 0)}px)`,
  }
})

const Layout = ({ children }) => {
  const routeName = useRouteName()
  const { logsOpen, setLogsOpen, navOpen, setNavOpen } = useApp()
  const [newLogRequested, setNewLogRequested] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'l') {
        e.preventDefault()
        setLogsOpen(true)
        setNavOpen(false)
        setNewLogRequested(true)
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
