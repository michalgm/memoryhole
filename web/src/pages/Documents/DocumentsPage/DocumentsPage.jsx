import { Add } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { Stack } from '@mui/system'
import { createPortal } from 'react-dom'
import { FormContainer, TextFieldElement } from 'react-hook-form-mui'

import { navigate, routes } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

import DataTable from 'src/components/DataTable/DataTable'
import Link from 'src/components/utils/Link'
import { useDisplayError } from 'src/components/utils/SnackBar'
import { collabDocumentSchema } from 'src/lib/FieldSchemas'

export const QUERY = gql`
  query CollabDocumentsQuery {
    collabDocuments {
      ...CollabDocumentFields
    }
  }
`

export const CreateDocumentButton = ({ children }) => {
  const headerTarget = document.getElementById('modal_layout_header_actions')
  const [open, setOpen] = React.useState(false)
  const handleClose = () => setOpen(false)
  const handleSubmit = (data) => {
    navigate(routes.document({ id: 'new', title: data.title }))
  }
  if (!headerTarget) return null

  const createDocumentButton = createPortal(
    <>
      <Stack direction="row" alignItems="center" spacing={2}>
        {children}
        <Button
          onClick={() => setOpen(true)}
          startIcon={<Add />}
          size="medium"
          variant="contained"
          color="secondary"
        >
          New Document
        </Button>
      </Stack>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <FormContainer defaultValues={{ title: '' }} onSuccess={handleSubmit}>
          <DialogTitle>New Document</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter a title for the new document.
            </DialogContentText>
            <TextFieldElement
              name="title"
              label="Document Title"
              fullWidth
              variant="outlined"
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="secondary">
              Create Document
            </Button>
          </DialogActions>
        </FormContainer>
      </Dialog>
    </>,
    headerTarget
  )
  return createDocumentButton
}

const DocumentsPage = () => {
  const displayError = useDisplayError()

  const { data, refetch, loading } = useQuery(QUERY, {
    onError: displayError,
  })

  const displayColumns = [
    'title',
    'created_at',
    'created_by.name',
    'updated_at',
    'last_editor.name',
  ]

  const tableProps = {
    enableColumnFilterModes: true,
    initialState: {
      showGlobalFilter: true,
      columnPinning: {
        left: ['mrt-row-select', 'title'],
      },
      sorting: [{ id: 'updated_at', desc: true }],
    },
  }

  const preColumns = [
    {
      accessorKey: 'title',
      header: 'Title',
      columnVisibility: true,
      Cell: ({ row, renderedCellValue }) => (
        <Link
          color="secondary"
          to={routes.document({ id: row.original.id, foo: 'bar' })}
        >
          {renderedCellValue || row.original.name}
        </Link>
      ),
    },
  ]

  return (
    <>
      <DataTable
        data={(data?.collabDocuments || []).filter(
          (d) => d.type === 'document'
        )}
        displayColumns={displayColumns}
        tableProps={tableProps}
        refetch={refetch}
        loading={loading}
        schema={collabDocumentSchema}
        preColumns={preColumns}
        type="collabDocuments"
        name="document"
      />
      <CreateDocumentButton />
    </>
  )
}

export default DocumentsPage
