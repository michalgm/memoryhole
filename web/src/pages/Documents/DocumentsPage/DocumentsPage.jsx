import { Add } from '@mui/icons-material'
import { Button, Dialog } from '@mui/material'
import { Stack } from '@mui/system'
import { createPortal } from 'react-dom'

import { navigate, routes } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

import DataTable from 'src/components/DataTable/DataTable'
import HasRoleAccess from 'src/components/utils/HasRoleAccess'
import Link from 'src/components/utils/Link'
import { useDisplayError } from 'src/components/utils/SnackBar'
import { documentSchema } from 'src/lib/FieldSchemas'
import { DocumentForm } from 'src/pages/Documents/DocumentPage/DocumentPage'

export const QUERY = gql`
  query DocumentsQuery {
    documents {
      ...DocumentFields
    }
  }
`

export const CreateDocumentButton = ({ children }) => {
  const headerTarget = document.getElementById('modal_layout_header_actions')
  const [open, setOpen] = React.useState(false)
  const handleClose = () => setOpen(false)
  const handleSubmit = (data) => {
    navigate(routes.document({ id: data.id }))
  }
  if (!headerTarget) return null

  const createDocumentButton = createPortal(
    <HasRoleAccess requiredRole="Operator">
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
        <DocumentForm handleClose={handleClose} onCreate={handleSubmit} />
      </Dialog>
    </HasRoleAccess>,
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
    'updated_by.name',
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
          to={routes.document({
            id: row.original.id,
          })}
        >
          {renderedCellValue || row.original.name}
        </Link>
      ),
    },
  ]

  return (
    <>
      <DataTable
        data={(data?.documents || []).filter((d) => d.type === 'document')}
        displayColumns={displayColumns}
        tableProps={tableProps}
        refetch={refetch}
        loading={loading}
        schema={documentSchema}
        preColumns={preColumns}
        type="documents"
        name="document"
      />
      <CreateDocumentButton />
    </>
  )
}

export default DocumentsPage
