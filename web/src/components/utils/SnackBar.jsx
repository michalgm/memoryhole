import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react'

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

export let globalDisplayError = null
const INVALID_AUTH_HEADER_ERROR =
  'Exception in getAuthenticationContext: The `Authorization` header is not valid.'

export const setGlobalDisplayError = (fn) => {
  globalDisplayError = fn
}

export const useSnackbar = () => {
  return useContext(SnackbarContext)
}

const errorList = (errors) => {
  const errorMessages = errors.map((err, index) => {
    const message = [err.message, err.extensions?.originalError?.message].join(
      ' '
    )
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
          {message}
        </Typography>
      </ListItem>
    )
  })
  return <List dense>{errorMessages}</List>
}

const formatError = (error) => {
  if (
    error?.graphQLErrors?.[0]?.extensions?.originalError?.message ===
      INVALID_AUTH_HEADER_ERROR ||
    error?.networkError?.result?.errors?.[0]?.extensions?.originalError
      ?.message === INVALID_AUTH_HEADER_ERROR
  ) {
    return
  }
  const message =
    typeof error === 'string'
      ? error
      : error?.message || error?.[0]?.message || 'Unknown error'

  const errors = [
    ...(error.graphQLErrors || []),
    ...(error.networkError?.result?.errors || []),
  ]
  const errorMessage = (
    <>
      <AlertTitle>Error</AlertTitle>
      <Typography gutterBottom>{message || 'Unknown error'}</Typography>
      {errors.length > 0 && (
        <Accordion sx={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2">Details</Typography>
          </AccordionSummary>
          <AccordionDetails>{errorList(errors)}</AccordionDetails>
        </Accordion>
      )}
    </>
  )
  return errorMessage
}

export const useDisplayError = () => {
  const { openSnackbar } = useSnackbar() // Access openSnackbar from your snackbar hook
  const displayError = useCallback(
    (error) => {
      openSnackbar(formatError(error), 'error')
    },
    [openSnackbar]
  )
  useEffect(() => {
    setGlobalDisplayError(displayError)
  }, [displayError])

  return displayError
}

export const SnackBarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
    duration: 4000,
  })

  const openSnackbar = (message, severity = 'success', duration = 4000) => {
    setSnackbar({ open: true, message, severity, duration })
  }

  const closeSnackbar = (event, reason) => {
    if (reason !== 'clickaway' && reason !== 'escapeKeyDown') {
      setSnackbar({ ...snackbar, open: false })
    }
  }

  const duration = snackbar.severity === 'success' ? snackbar.duration : null
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
