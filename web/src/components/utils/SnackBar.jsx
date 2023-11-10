import { createContext, useContext, useState } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import { Alert, IconButton, Snackbar } from '@mui/material'

const SnackbarContext = createContext()

export const useSnackbar = () => {
  return useContext(SnackbarContext)
}

export const SnackBarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  })

  const openSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity })
  }

  // Function to close the Snackbar
  const closeSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'success' })
  }

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={closeSnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  )
  const duration = snackbar.severity === 'success' ? 4000 : null

  return (
    <SnackbarContext.Provider value={{ openSnackbar, closeSnackbar }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={duration}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
          {snackbar.severity !== 'error' && action}
        </Alert>
      </Snackbar>
      {children}
    </SnackbarContext.Provider>
  )
}
