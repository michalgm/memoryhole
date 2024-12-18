import { Paper, Stack } from '@mui/material'

const Footer = ({ children }) => {
  return (
    <Paper
      id="footer"
      elevation={4}
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? 'primary.main' : 'background.paper',
        color: 'contrast.main',
        p: 2,
        zIndex: 12,
        position: 'relative',
      }}
    >
      <Stack
        direction={'row'}
        maxWidth={'lg'}
        alignItems="center"
        // sx={{ margin: 'auto', width: 'inherit', height: 5 }}
        spacing={2}
      >
        {children}
      </Stack>
    </Paper>
  )
}

export default Footer
