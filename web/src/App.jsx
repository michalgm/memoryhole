import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './index.css'
import './scaffold.css'

import * as React from 'react'

import { ApolloLink } from '@apollo/client'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
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

export const theme = createTheme({
  palette: {
    contrastThreshold: 4.5,
    primary: { main: '#37474f' },
    secondary: { main: '#ad1457' },
    success: { main: '#392e3d' },
    error: { main: '#FF5449' },
  },
  typography: {
    h1: { fontSize: '2.25rem' },
    h2: { fontSize: '1.625rem' },
    h3: { fontSize: '1.25rem' },
    h4: { fontSize: '1.125rem' },
    h5: { fontSize: '0.875rem' },
    h6: { fontSize: '0.875rem' },
  },
})

// Inject error handler into Apollo Link chain
const link = (rwlinks) =>
  ApolloLink.from([ErrorHandler, ...rwlinks.map((l) => l.link)])

const App = () => (
  <React.Fragment>
    <CssBaseline />
    <FatalErrorBoundary page={FatalErrorPage}>
      <SnackBarProvider>
        <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
          <ThemeProvider theme={theme}>
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
          </ThemeProvider>
        </RedwoodProvider>
      </SnackBarProvider>
    </FatalErrorBoundary>
  </React.Fragment>
)

export default App
