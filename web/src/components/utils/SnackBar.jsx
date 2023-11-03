import { Alert, Button, IconButton, Snackbar } from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'

export default function SnackBar({
  handleClose,
  open,
  severity,
  message,
  alertProps = {},
  ...props
}) {
  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  )
  if (handleClose) {
    props.action = action
    props.onClose = handleClose
  }
  return (
    <Snackbar
      open={open}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      {...props}
    >
        <Alert severity={severity} sx={{ width: '100%' }} {...alertProps}>
        {message}
        {action}
      </Alert>
    </Snackbar>
  )
}
