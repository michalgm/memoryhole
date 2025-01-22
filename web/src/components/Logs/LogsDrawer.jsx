import { useEffect, useState } from 'react'

import { Drawer, Stack } from '@mui/material'

import Show from 'src/components/utils/Show'

import Logs from './Logs'

const LogsDrawer = ({ open, width, newLogRequested, onNewLogComplete }) => {
  const [hasBeenOpened, setHasBeenOpened] = useState(false)
  useEffect(() => {
    if (open && !hasBeenOpened) {
      setHasBeenOpened(true)
    }
  }, [open, hasBeenOpened])
  return (
    <Stack
      direction="column"
      alignItems="end"
      spacing={1}
      id="arrestee-logs-drawer"
      sx={{
        position: 'fixed',
        top: 48, // Matches AppBar height
        right: 0,
        zIndex: 1000,
      }}
    >
      <Drawer
        sx={[
          {
            width,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width,
              marginTop: '48px',
              height: 'calc(100% - 48px)',
              pt: 1,
            },
          },
        ]}
        variant="persistent"
        anchor="right"
        open={open}
        PaperProps={{ id: 'arrestee-logs-drawer-container' }}
      >
        <Show when={hasBeenOpened}>
          <Logs
            sidebar
            newLogRequested={newLogRequested}
            onNewLogComplete={onNewLogComplete}
          />
        </Show>
      </Drawer>
    </Stack>
  )
}

export default LogsDrawer
