import { Grid, Stack } from '@mui/material'

const Footer = ({ children }) => {
  return (
    <Grid
      id="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: 'primary.main',
        color: 'white',
        zIndex: 10,
        p: 2,
      }}
    >
      <Stack
        direction={'row'}
        maxWidth={'lg'}
        alignItems="center"
        sx={{ margin: 'auto' }}
        spacing={2}
      >
        {children}
      </Stack>
    </Grid>
  )
}

export default Footer
