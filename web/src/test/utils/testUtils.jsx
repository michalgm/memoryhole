import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { MockProviders, render } from '@redwoodjs/testing/web'

import AppProvider from 'src/lib/AppContext'
import theme from 'src/theme'

const ProviderWrapper = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MockProviders>
          <AppProvider>{children}</AppProvider>
        </MockProviders>
      </LocalizationProvider>
    </CssBaseline>
  </ThemeProvider>
)

export const customRender = (ui, options) => {
  return render(ui, { wrapper: ProviderWrapper, ...options })
}
