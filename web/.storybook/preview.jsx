import { CssBaseline, Paper } from '@mui/material'
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  useColorScheme,
} from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { RedwoodProvider } from '@redwoodjs/web'
import { useEffect } from 'react'
import { SnackBarProvider } from '../src/components/utils/SnackBar'
import AppProvider from '../src/lib/AppContext'
import theme from '../src/theme'

export const globalTypes = {
  displayMode: {
    name: 'Theme Mode',
    description: 'Color scheme for components',
    defaultValue: 'light',
    toolbar: {
      title: 'Theme Mode',
      items: ['light', 'dark'],
      showName: true,
    },
  },
}

const ModeProvider = ({ mode }) => {
  const { setMode } = useColorScheme()
  useEffect(() => {
    setMode(mode)
  }, [mode])
}

export const decorators = [
  (Story, context) => {
    return (
      <CssVarsProvider theme={theme} modeStorageKey={`mui-storybook-`}>
        <CssBaseline enableColorScheme />
        <ModeProvider mode={context.globals.displayMode} />
        <SnackBarProvider>
          <Paper sx={{ p: 5 }}>
            <RedwoodProvider>
              <AppProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Story />
                </LocalizationProvider>
              </AppProvider>
            </RedwoodProvider>
          </Paper>
        </SnackBarProvider>
      </CssVarsProvider>
    )
  },
]
