import React, { useEffect } from 'react'

import { CssBaseline, Paper } from '@mui/material'
import { ThemeProvider, useColorScheme } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { RouterContextProvider } from '@cedarjs/router/dist/router-context'
import { mockGraphQLQuery } from '@cedarjs/testing/web'
import { RedwoodProvider } from '@cedarjs/web'
import { RedwoodApolloProvider } from '@cedarjs/web/apollo'

import { AuthProvider, useAuth } from '../src/auth'
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
      items: [
        { value: 'light', title: 'Light Mode', icon: 'sun' },
        { value: 'dark', title: 'Dark Mode', icon: 'moon' },
      ],
      dynamicTitle: true,
    },
  },
  showFormValues: {
    name: 'Form Values',
    defaultValue: false,
    toolbar: {
      title: 'Form Values',
      items: [
        { value: false, title: 'Hide Form Values' },
        { value: true, title: 'Show Form Values' },
      ],
      dynamicTitle: true,
    },
  },
}

mockGraphQLQuery('SiteSettingsQuery', () => {
  return {
    siteSettings: [],
  }
})

const ModeProvider = ({ mode }) => {
  const { setMode } = useColorScheme()
  useEffect(() => {
    setMode(mode)
  }, [mode]) // eslint-disable-line react-hooks/exhaustive-deps
}

export const decorators = [
  (Story, context) => {
    return (
      <ThemeProvider theme={theme} modeStorageKey={`mui-storybook-`}>
        <CssBaseline enableColorScheme />
        <ModeProvider mode={context.globals.displayMode} />
        <SnackBarProvider>
          <Paper sx={{ p: 5 }}>
            <RedwoodProvider>
              <AppProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <AuthProvider>
                    <RedwoodApolloProvider useAuth={useAuth}>
                      <RouterContextProvider
                        routes={[]}
                        paramTypes={{}}
                        activeRouteName={undefined}
                      >
                        <Story />
                      </RouterContextProvider>
                    </RedwoodApolloProvider>
                  </AuthProvider>
                </LocalizationProvider>
              </AppProvider>
            </RedwoodProvider>
          </Paper>
        </SnackBarProvider>
      </ThemeProvider>
    )
  },
]
