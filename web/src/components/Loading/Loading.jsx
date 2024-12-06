import { Box, CircularProgress } from '@mui/material'

const Loading = ({ size = 150, ...props }) => {
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
      <CircularProgress size={size} />
    </Box>
  )
}

export default Loading
