import { Button, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material'
import { Box } from '@mui/system'

const LoadingButton = ({
  loading,
  children,
  containerProps = {},
  color = 'primary',
  disabled = false,
  ...props
}) => {
  const theme = useTheme()

  return (
    <Box
      {...containerProps}
      sx={{ position: 'relative', ...containerProps.sx }}
    >
      <Button
        {...props}
        color={color}
        disabled={loading || disabled}
        sx={{
          '&.Mui-disabled': {
            color: `${color}.light`,
            bgcolor: `${color}.dark`,
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
