import { Box, Button, CircularProgress, useTheme } from '@mui/material'

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
      sx={{
        position: 'relative',
        display: 'inline-block',
        ...containerProps.sx,
      }}
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
        {children}
      </Button>
      {loading && (
        <CircularProgress
          size={24}
          sx={{
            color:
              props?.variant === 'outlined'
                ? color
                : theme?.palette?.contrast?.main
                  ? 'contrast.main'
                  : 'primary.main',
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
