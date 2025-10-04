import { useEffect } from 'react'

import { Edit } from '@mui/icons-material'
import { Box, Button } from '@mui/material'

import { useLocation } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

import CollabEditor from 'src/components/CollabEditor/CollabEditor'
import Loading from 'src/components/Loading/Loading'
import { useApp } from 'src/lib/AppContext'
import { CreateDocumentButton } from 'src/pages/Documents/DocumentsPage/DocumentsPage'
export const QUERY = gql`
  query EditDocument($id: String!) {
    document: collabDocument(id: $id) {
      ...CollabDocumentFields
    }
  }
`

const DocumentPage = ({ id }) => {
  const { setPageTitle } = useApp()
  const { search } = useLocation()
  const [editable, setEditable] = React.useState(id === 'new')

  const { data, loading } = useQuery(QUERY, { variables: { id } })

  const title =
    new URLSearchParams(search).get('title') ||
    data?.document?.title ||
    'Untitled Document'

  useEffect(() => {
    setPageTitle({ document: title })
  }, [setPageTitle, title])

  if (loading) return <Loading />

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
        editable={editable}
        type="document"
        title={title}
        documentName={id === 'new' ? undefined : `${data?.document?.name}`}
      />
      <CreateDocumentButton>
        {editable ? null : (
          <Button
            variant="outlined"
            color="primary"
            size="medium"
            startIcon={<Edit />}
            onClick={() => setEditable(true)}
          >
            Edit Document
          </Button>
        )}
      </CreateDocumentButton>
    </Box>
  )
}

export default DocumentPage
