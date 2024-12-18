import { useCallback } from 'react'

import {
  ChevronLeft,
  ChevronRight,
  Flag,
  Menu,
  MenuOpen,
} from '@mui/icons-material'
import {
  AppBar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'

import { Link, routes } from '@redwoodjs/router'

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

const NavBar = ({ navOpen, setNavOpen, setLogsOpen, logsOpen, height }) => {
  const { currentAction, setCurrentAction } = useApp()

  const transformOptions = useCallback(
    (options) => [defaultAction, ...options],
    []
  )
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
            <Tooltip title={`Version: ${import.meta.env.APP_VERSION}`}>
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
            <Tooltip
              title={
                <p>
                  Toggle Logs Panel
                  <br />
                  (CTRL-L to quickly create a new log)
                </p>
              }
            >
              <Button
                onClick={() => setLogsOpen(!logsOpen)}
                variant="outlined"
                color="secondary"
                sx={{
                  color: 'var(--mui-palette-contrast-main)',
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

export default NavBar
