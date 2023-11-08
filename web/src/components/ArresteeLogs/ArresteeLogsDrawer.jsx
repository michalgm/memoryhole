import { useState } from 'react'

import { ChevronRight, Notes } from '@mui/icons-material'
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'

import ArresteeLogsCell from './ArresteeLogsCell'

const ArresteeLogsDrawer = (props) => {
  console.log(props)
  const [open, setOpen] = useState(false)
  if (!open) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 80,
          right: 0,
          border: '1px solid',
          borderRight: 'none',
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          startIcon={<Notes />}
        >
          Logs
        </Button>
      </Box>
    )
  }
  return (
    <Drawer
      sx={{
        width: 400,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 400,
        },
      }}
      variant="persistent"
      anchor="right"
      open={open}
    >
      {/* <DrawerHeader> */}
      {/* onClick={handleDrawerClose} */}
      <IconButton onClick={() => setOpen(false)}>
        <ChevronRight />
      </IconButton>
      {/* </DrawerHeader> */}
      <Divider />
      {props.arrestee_id && (
        <ArresteeLogsCell arrestee_id={props.arrestee_id} />
      )}
    </Drawer>
  )
}

export default ArresteeLogsDrawer
