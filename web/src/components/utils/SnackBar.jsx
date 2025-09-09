import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
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
  ListItemText,
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

const errorsDetails = (errors) => {
  const errorMessage = (stack, index) => {
    return (
      <ListItem key={`error-${index}`}>
        <ListItemText primary="Stack trace:" />
        <Typography
          component="pre"
          variant="body2"
          sx={{
            fontFamily: 'monospace', // Monospace font
            whiteSpace: 'pre-wrap', // Preserve formatting and wrap long lines
          }}
        >
          {stack}
        </Typography>
      </ListItem>
    )
  }

  const stacks = errors.reduce((acc, err, index) => {
    const stack = err.stack || err.extensions?.originalError?.stack
    if (stack && !acc.includes(stack)) {
      acc.push(errorMessage(stack, index))
    }
    return acc
  }, [])
  if (stacks.length === 0) {
    return null
  }
  return (
    <Accordion sx={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="body2">Details</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <List dense>{stacks}</List>
      </AccordionDetails>
    </Accordion>
  )
}

const formatError = (error) => {
  if (React.isValidElement(error)) {
    return error
  }

  if (
    error?.graphQLErrors?.[0]?.extensions?.originalError?.message ===
      INVALID_AUTH_HEADER_ERROR ||
    error?.networkError?.result?.errors?.[0]?.extensions?.originalError
      ?.message === INVALID_AUTH_HEADER_ERROR
  ) {
    return
  }

  let rootMessage =
    typeof error === 'string'
      ? error
      : error?.message ||
        error?.graphQLErrors?.[0]?.message ||
        error?.[0]?.message ||
        'Unknown error'

  const errors = [
    ...(error.graphQLErrors || []),
    ...(error.networkError?.result?.errors || []),
  ]
  if (error?.[0]?.extensions?.code === 'BAD_USER_INPUT') {
    rootMessage = 'Errors prevented this form from being saved:'
  }
  const errorMessage = (
    <>
      <AlertTitle>Error</AlertTitle>
      <Typography gutterBottom>{rootMessage}</Typography>
      {errors.length > 0 && (
        <>
          <ul>
            {errors.map((error, index) => {
              let message = error.message
              let secondaryMessage = error.extensions?.originalError?.message

              if (message === rootMessage) {
                if (!secondaryMessage) {
                  return null
                } else {
                  message = secondaryMessage
                }
              }
              return (
                <li key={index}>
                  {message}{' '}
                  {secondaryMessage &&
                    secondaryMessage != message &&
                    `(${secondaryMessage})`}
                </li>
              )
            })}
          </ul>
          {errorsDetails(errors)}
        </>
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

const DEFAULT_SNACKBAR_STATE = {
  open: false,
  message: '',
  severity: 'success',
  duration: 4000,
}

export const SnackBarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState(DEFAULT_SNACKBAR_STATE)

  const openSnackbar = useCallback(
    (message, severity = 'success', duration = 4000) => {
      setSnackbar({ open: true, message, severity, duration })
    },
    []
  )

  const closeSnackbar = useCallback((event, reason) => {
    if (reason !== 'clickaway' && reason !== 'escapeKeyDown') {
      setSnackbar((current) => ({ ...current, open: false }))
    }
  }, [])

  const duration = snackbar.severity === 'success' ? snackbar.duration : null
  return (
    <SnackbarContext.Provider value={{ openSnackbar, closeSnackbar }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={duration}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ maxWidth: 700 }}
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
