import { Box } from '@mui/material'

import CollabEditor from 'src/components/CollabEditor/CollabEditor'

const ActionWhiteboardPage = ({ id }) => {
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        display: 'flex',
        flexGrow: 1,
        // overflow: 'auto',
        height: 'calc(100vh - var(--header-height) - 103px)',
      }}
      className=""
    >
      <CollabEditor documentName={`action:${id}`} />
    </Box>
  )
}

export default ActionWhiteboardPage
