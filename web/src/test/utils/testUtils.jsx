import { CssBaseline, Experimental_CssVarsProvider } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { MockProviders, render } from '@redwoodjs/testing/web'

import { theme } from 'src/App'
import AppProvider from 'src/lib/AppContext'

const ProviderWrapper = ({ children }) => (
  <Experimental_CssVarsProvider theme={theme}>
    <CssBaseline enableColorScheme>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MockProviders>
          <AppProvider>{children}</AppProvider>
        </MockProviders>
      </LocalizationProvider>
    </CssBaseline>
  </Experimental_CssVarsProvider>
)

export const customRender = (ui, options) => {
  return render(ui, { wrapper: ProviderWrapper, ...options })
}
