import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './scaffold.css'
import './index.css'

import * as React from 'react'

import { AuthProvider, useAuth } from './auth'
import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { ThemeProvider, createTheme } from '@mui/material/styles'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ConfirmProvider } from 'material-ui-confirm'
import CssBaseline from '@mui/material/CssBaseline'
import FatalErrorPage from 'src/pages/FatalErrorPage'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'
import Routes from 'src/Routes'
import { SnackBarProvider } from './components/utils/SnackBar'

const theme = createTheme({
  palette: {
    primary: { main: '#37474f' },
    secondary: { main: '#ef6c00' },
  },
})
const App = () => (
  <React.Fragment>
    <CssBaseline />
    <FatalErrorBoundary page={FatalErrorPage}>
      <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <RedwoodApolloProvider useAuth={useAuth}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ConfirmProvider>
                  <SnackBarProvider>
                    <Routes />
                  </SnackBarProvider>
                </ConfirmProvider>
              </LocalizationProvider>
            </RedwoodApolloProvider>
          </AuthProvider>
        </ThemeProvider>
      </RedwoodProvider>
    </FatalErrorBoundary>
  </React.Fragment>
)

export default App