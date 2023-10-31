import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './scaffold.css'
import './index.css'

import * as React from 'react'

import { AuthProvider, useAuth } from './auth'
import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import CssBaseline from '@mui/material/CssBaseline'
import FatalErrorPage from 'src/pages/FatalErrorPage'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'
import Routes from 'src/Routes'
import calendar from 'dayjs/plugin/calendar'
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';

dayjs.extend(calendar)
dayjs.extend(customParseFormat);
const theme = createTheme({
  palette: {
    primary: { main: '#37474f' },
    secondary: { main: '#ef6c00' },
  },
})
console.log(theme)
const App = () => (
  <React.Fragment>
    <CssBaseline />
      <FatalErrorBoundary page={FatalErrorPage}>
        <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
          <ThemeProvider theme={theme}>
            <AuthProvider>
              <RedwoodApolloProvider useAuth={useAuth}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Routes />
                </LocalizationProvider>
              </RedwoodApolloProvider>
            </AuthProvider>
            </ThemeProvider>
        </RedwoodProvider>
      </FatalErrorBoundary>
  </React.Fragment>
)

export default App
