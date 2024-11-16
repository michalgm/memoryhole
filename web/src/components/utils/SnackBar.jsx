import { createContext, useContext, useState } from 'react'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  List,
  ListItem,
  Snackbar,
  Typography,
} from '@mui/material'

const SnackbarContext = createContext()

export const useSnackbar = () => {
  return useContext(SnackbarContext)
}

const errorList = (errors) => {
  const errorMessages = errors.map((err, index) => {
    return (
      <ListItem key={`error-${index}`}>
        <Typography
          component="pre"
          variant="body2"
          sx={{
            fontFamily: 'monospace', // Monospace font
            whiteSpace: 'pre-wrap', // Preserve formatting and wrap long lines
          }}
        >
          {err.message}
        </Typography>
      </ListItem>
    )
  })
  return <List dense>{errorMessages}</List>
}
export const useDisplayError = () => {
  const { openSnackbar } = useSnackbar() // Access openSnackbar from your snackbar hook

  return (error) => {
    const errorMessage = (
      <>
        <AlertTitle>Error</AlertTitle>
        <Typography gutterBottom>{error.message}</Typography>

        <Accordion sx={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2">Details</Typography>
          </AccordionSummary>

          <AccordionDetails>
            {error.graphQLErrors?.length > 0 && (
              <>
                <Typography variant="subtitle2">GraphQL Errors:</Typography>
                {errorList(error.graphQLErrors)}
              </>
            )}

            {error.networkError?.result?.errors?.length > 0 && (
              <>
                <Typography variant="subtitle2">Network Errors:</Typography>
                {errorList(error.networkError.result.errors)}
              </>
            )}
          </AccordionDetails>
        </Accordion>
      </>
    )

    openSnackbar(errorMessage, 'error')
  }
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

  const closeSnackbar = (event, reason) => {
    if (reason !== 'clickaway' && reason !== 'escapeKeyDown') {
      setSnackbar({ ...snackbar, open: false })
    }
  }

  const duration = snackbar.severity === 'success' ? 4000 : null

  return (
    <SnackbarContext.Provider value={{ openSnackbar, closeSnackbar }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={duration}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{
            width: '100%',
            border: '1px solid',
            borderColor: `${snackbar.severity}.light`,
          }}
          onClose={closeSnackbar}
        >
          {snackbar.message}
          {/* {snackbar.severity !== 'error' && action} */}
          {/* {action} */}
        </Alert>
      </Snackbar>
      {children}
    </SnackbarContext.Provider>
  )
}
