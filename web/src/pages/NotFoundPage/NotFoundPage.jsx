import { Box, Paper, Typography } from '@mui/material'

export default () => (
  <main>
    <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center' }}>
      <Paper sx={{ p: 5, maxWidth: 1 / 3, margin: 'auto' }}>
        <Typography variant="h1">404 Page Not Found</Typography>
      </Paper>
    </Box>
  </main>
)
