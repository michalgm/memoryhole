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
      <CollabEditor
        sx={{
          mt: 0,
          height: '100%',
          '&& .MuiBox-root': {
            height: '100%',
          },
          '&& .MuiTiptap-RichTextContent-root': {
            height: 'calc(100% - 48px)',
            // backgroundColor: 'blue',
          },
          '&& .ProseMirror': {
            height: '100%',
            overflow: 'auto',
            minHeight: 300,
            // backgroundColor: 'yellow',
          },
        }}
        documentName={`action:${id}`}
      />
    </Box>
  )
}

export default ActionWhiteboardPage
