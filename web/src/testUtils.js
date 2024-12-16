import { Experimental_CssVarsProvider } from '@mui/material'

import { MockProviders, render } from '@redwoodjs/testing/web'

import { theme } from 'src/App'

const ProviderWrapper = ({ children }) => (
  <Experimental_CssVarsProvider theme={theme}>
    <MockProviders>{children}</MockProviders>
  </Experimental_CssVarsProvider>
)
const customRender = (ui, options) => {
  return render(ui, { wrapper: ProviderWrapper, ...options })
}

export { customRender as render }
