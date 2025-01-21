import { Box, CircularProgress } from '@mui/material'

const Loading = ({ size = 150, name = 'loader', ...props }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        ...props,
      }}
    >
      <CircularProgress size={size} aria-label={name} />
    </Box>
  )
}

export default Loading
