import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './index.css'

import * as React from 'react'

import { ApolloLink } from '@apollo/client'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
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
import theme from './theme'

// Inject error handler into Apollo Link chain
const link = (rwlinks) =>
  ApolloLink.from([ErrorHandler, ...rwlinks.map((l) => l.link)])

const App = () => {
  return (
    <React.Fragment>
      <FatalErrorBoundary page={FatalErrorPage}>
        <CssVarsProvider theme={theme} defaultMode={'system'}>
          <CssBaseline enableColorScheme />
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
        </CssVarsProvider>
      </FatalErrorBoundary>
    </React.Fragment>
  )
}

export default App
