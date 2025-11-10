import { Menu, MenuOpen } from '@mui/icons-material'
import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'

import { Link, routes } from '@redwoodjs/router'

import NavBarControls from 'src/layouts/MainLayout/NavBarControls'
import { useApp } from 'src/lib/AppContext'
import dayjs from 'src/lib/dayjs'

const NavBar = ({ navOpen, setNavOpen, setLogsOpen, logsOpen, height }) => {
  const { currentAction, setCurrentAction } = useApp()

  return (
    <Box component="header" sx={{ flexGrow: 1, height }}>
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
            <Tooltip
              //  Note this isn't actually process.env - just a placeholder string for the Vite define to replace at build time
              title={`Version: ${process.env.APP_VERSION || 'Unknown'} (Built ${process.env.BUILD_TIMESTAMP ? dayjs(process.env.BUILD_TIMESTAMP).tz().format('L LT') : 'Unknown'})`}
            >
              <Typography
                variant="h4"
                noWrap
                component={Link}
                to={routes.home()}
                sx={(theme) => ({
                  color: 'contrast.main',
                  flexGrow: 0,
                  fontFamily: 'monospace',
                  textDecoration: 'none',
                  ...theme.applyStyles('dark', {
                    color: 'secondary.light',
                  }),
                })}
              >
                memoryhole
              </Typography>
            </Tooltip>

            <NavBarControls
              {...{
                currentAction,
                setCurrentAction,
                logsOpen,
                setLogsOpen,
              }}
            />
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default NavBar
