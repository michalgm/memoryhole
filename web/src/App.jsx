import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './index.css'

import * as React from 'react'

import { ApolloLink } from '@apollo/client'
import { blueGrey, pink } from '@mui/material/colors'
import CssBaseline from '@mui/material/CssBaseline'
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
} from '@mui/material/styles'
import { alpha, getContrastRatio } from '@mui/system'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ConfirmProvider } from 'material-ui-confirm'

import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import FatalErrorPage from 'src/pages/FatalErrorPage'
import Routes from 'src/Routes'

import { AuthProvider, useAuth } from './auth'
import { SnackBarProvider } from './components/utils/SnackBar'
import ErrorHandler from './lib/ErrorHandler'

// Inject error handler into Apollo Link chain
const link = (rwlinks) =>
  ApolloLink.from([ErrorHandler, ...rwlinks.map((l) => l.link)])

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: blueGrey[700],
        },
        secondary: {
          main: pink[800],
        },
        contrast: {
          main: '#fff',
          light: alpha('#fff', 0.5),
          dark: alpha('#fff', 0.9),
          contrastText:
            getContrastRatio('#fff', '#fff') > 4.5 ? '#fff' : '#111',
        },
        background: {
          body: '#f3f3f3',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: blueGrey[400],
        },
        secondary: {
          main: pink[800],
        },
        contrast: {
          main: '#fff',
          light: alpha('#fff', 0.5),
          dark: alpha('#fff', 0.9),
          contrastText:
            getContrastRatio('#fff', '#fff') > 4.5 ? '#fff' : '#111',
        },
        background: {
          body: 'inherit',
        },
      },
    },
  },
  typography: {
    h1: { fontSize: '2.5rem' },
    h2: { fontSize: '2.2rem' },
    h3: { fontSize: '1.9rem' },
    h4: { fontSize: '1.6rem' },
    h5: { fontSize: '1.4rem' },
    h6: { fontSize: '1.2rem' },
  },
  custom: {
    scrollAreaHeight: 'calc(100vh - 283px)',
  },
})

const App = () => {
  return (
    <React.Fragment>
      <CssVarsProvider theme={theme} defaultMode={'system'}>
        <CssBaseline enableColorScheme />
        <FatalErrorBoundary page={FatalErrorPage}>
          <SnackBarProvider>
            <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
              <AuthProvider>
                <RedwoodApolloProvider
                  useAuth={useAuth}
                  graphQLClientConfig={{ link }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <ConfirmProvider
                      defaultOptions={{
                        confirmationButtonProps: {
                          variant: 'contained',
                          color: 'secondary',
                        },
                        cancellationButtonProps: { variant: 'outlined' },
                      }}
                    >
                      <Routes />
                    </ConfirmProvider>
                  </LocalizationProvider>
                </RedwoodApolloProvider>
              </AuthProvider>
            </RedwoodProvider>
          </SnackBarProvider>
        </FatalErrorBoundary>
      </CssVarsProvider>
    </React.Fragment>
  )
}

export default App
