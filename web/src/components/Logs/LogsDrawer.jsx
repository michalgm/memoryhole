import { Drawer } from '@mui/material'
import { Stack } from '@mui/system'

import Logs from './Logs'

const LogsDrawer = ({ open, width, newLogRequested, onNewLogComplete }) => {
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
      >
        {open && (
          <Logs
            sidebar
            newLogRequested={newLogRequested}
            onNewLogComplete={onNewLogComplete}
          />
        )}
      </Drawer>
    </Stack>
  )
}

export default LogsDrawer
