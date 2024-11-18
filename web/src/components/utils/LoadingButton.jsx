import { Button, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material'
import { Box } from '@mui/system'

const LoadingButton = ({ loading, children, ...props }) => {
  const theme = useTheme()

  return (
    <Box sx={{ position: 'relative' }}>
      <Button
        {...props}
        sx={{
          '&.Mui-disabled': {
            color: 'text.disabled',
            bgcolor: `${props.color}.main`,
            borderColor: `${props.color}.main`,
          },
          ...props.sx,
        }}
      >
        {...children}
      </Button>
      {loading && (
        <CircularProgress
          size={24}
          sx={{
            color: theme.palette.primary.contrastText,
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      )}
    </Box>
  )
}

export default LoadingButton
