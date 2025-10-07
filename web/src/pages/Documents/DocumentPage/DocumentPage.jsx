import { useEffect } from 'react'

import { Edit } from '@mui/icons-material'
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Popper,
} from '@mui/material'
import { Stack } from '@mui/system'

import { navigate, routes, useLocation } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

import CollabEditor from 'src/components/CollabEditor/CollabEditor'
import Loading from 'src/components/Loading/Loading'
import { BaseForm } from 'src/components/utils/BaseForm'
import { FormContainerSectionFields } from 'src/components/utils/FormContainer'
import HasRoleAccess from 'src/components/utils/HasRoleAccess'
import Show from 'src/components/utils/Show'
import { useApp } from 'src/lib/AppContext'
import { documentSchema } from 'src/lib/FieldSchemas'
import { CreateDocumentButton } from 'src/pages/Documents/DocumentsPage/DocumentsPage'

export const QUERY = gql`
  query EditDocument($id: String!) {
    document: document(id: $id) {
      ...DocumentFields
    }
  }
`

export const UPDATE_DOCUMENT_MUTATION = gql`
  mutation UpdateDocumentMutation($id: String!, $input: UpdateDocumentInput!) {
    updateDocument(id: $id, input: $input) {
      ...DocumentFields
    }
  }
`

export const CREATE_DOCUMENT_MUTATION = gql`
  mutation CreateDocumentMutation($input: CreateDocumentInput!) {
    createDocument(input: $input) {
      ...DocumentFields
    }
  }
`

export const DELETE_DOCUMENT_MUTATION = gql`
  mutation DeleteDocumentMutation($id: String!) {
    deleteDocument(id: $id) {
      id
    }
  }
`

export const DocumentForm = ({ id, onUpdate, onCreate, handleClose }) => {
  const formConfig = {
    id,
    modelType: 'Document',
    namePath: 'title',
    defaultValues: {
      access_role: 'Restricted',
      edit_role: 'Operator',
      type: 'document',
    },
    onCreate: (data) => {
      onCreate && onCreate(data)
      handleClose()
    },
    onUpdate: (data) => {
      onUpdate && onUpdate(data)
      handleClose()
    },
    onDelete: () => {
      navigate(routes.documents())
      handleClose()
    },
    fetchQuery: QUERY,
    updateMutation: UPDATE_DOCUMENT_MUTATION,
    createMutation: CREATE_DOCUMENT_MUTATION,
    deleteMutation: DELETE_DOCUMENT_MUTATION,
  }

  const fields = ['title', 'access_role', 'edit_role'].map((name) => [
    name,
    documentSchema[name].props,
  ])
  return (
    <BaseForm formConfig={formConfig}>
      {({ confirmDelete }) => (
        <>
          <DialogTitle>{id ? 'Edit' : 'New'} Document Properties</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <FormContainerSectionFields
                schema={documentSchema}
                highlightDirty={true}
                fieldProps={{}}
                fields={fields}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Show when={Boolean(id)}>
              <Button variant="outlined" onClick={confirmDelete}>
                Delete Document
              </Button>
            </Show>
            <Button type="submit" variant="contained" color="secondary">
              {id ? 'Update' : 'Create'} Document
            </Button>
          </DialogActions>
        </>
      )}
    </BaseForm>
  )
}

const DocumentPage = ({ id }) => {
  const { setPageTitle } = useApp()
  const { search } = useLocation()
  const [editable, setEditable] = React.useState(id === 'new')
  const [formAnchor, setFormAnchor] = React.useState(null)

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
      <Popper
        open={formAnchor !== null}
        anchorEl={formAnchor}
        placement="bottom-end"
      >
        <Paper elevation={3}>
          <DocumentForm id={id} handleClose={() => setFormAnchor(null)} />
        </Paper>
      </Popper>
      <CollabEditor
        editable={editable}
        type="document"
        title={title}
        editDocumentProperties={(e) =>
          setFormAnchor(e.target.closest('.MuiTiptap-MenuButton-root'))
        }
        documentName={id === 'new' ? undefined : `${data?.document?.name}`}
      />
      <CreateDocumentButton>
        {editable ? null : (
          <HasRoleAccess requiredRole={data?.document?.edit_role}>
            <Button
              variant="outlined"
              color="primary"
              size="medium"
              startIcon={<Edit />}
              onClick={() => setEditable(true)}
            >
              Edit Document
            </Button>
          </HasRoleAccess>
        )}
      </CreateDocumentButton>
    </Box>
  )
}

export default DocumentPage
