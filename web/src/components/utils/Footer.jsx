import { Paper, Stack } from '@mui/material'

const Footer = ({ children }) => {
  return (
    <Paper
      id="footer"
      elevation={4}
      sx={{
        position: 'sticky',
        bottom: 0,
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? 'primary.main' : 'background.paper',
        color: 'white',
        zIndex: 10,
        p: 2,
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
