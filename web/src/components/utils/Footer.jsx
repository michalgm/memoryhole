import { Paper, Stack } from '@mui/material'

const Footer = ({ children }) => {
  return (
    <Paper
      id="footer"
      elevation={4}
      sx={(theme) => ({
        backgroundColor: 'primary.main',
        color: 'contrast.main',
        p: 2,
        zIndex: 12,
        position: 'relative',
        ...theme.applyStyles('dark', {
          backgroundColor: 'Background.paper',
        }),
      })}
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
