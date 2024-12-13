import { useEffect, useState } from 'react'

import { Paper, Stack } from '@mui/material'

const Footer = ({ children }) => {
  const mainContent = document.getElementById('container')

  const [width, setWidth] = useState(mainContent?.offsetWidth)

  useEffect(() => {
    const handleResize = () => {
      setWidth(mainContent?.offsetWidth)
    }

    window.addEventListener('resize', handleResize)
    // Listen for nav drawer transitions
    let observer
    if (mainContent) {
      observer = new ResizeObserver(handleResize)
      observer.observe(mainContent)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      observer?.disconnect()
    }
  }, [])

  return (
    <Paper
      id="footer"
      elevation={4}
      sx={{
        position: 'fixed',
        bottom: 0,
        // mx: '-40px',
        // right: 0,
        // left: 0,
        // width: 'inherit',
        // width: '100%',
        // maxWidth: '100%',
        // maxWidth: 'inherit',
        width: width - 48,

        // left: 0,
        // right: 0,
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
