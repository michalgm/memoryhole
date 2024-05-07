import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import TableViewForm from 'src/components/TableView/TableViewForm'

export const QUERY = gql`
  query EditTableViewById($id: Int!) {
    tableView: tableView(id: $id) {
      id
      name
      state
      type
      created_at
      created_by_id
      updated_at
      updated_by_id
    }
  }
`

const UPDATE_TABLE_VIEW_MUTATION_GENERIC = gql`
  mutation DefaultUpdateTableViewMutation(
    $id: Int!
    $input: UpdateTableViewInput!
  ) {
    updateTableView(id: $id, input: $input) {
      id
      name
      state
      type
      created_at
      created_by_id
      updated_at
      updated_by_id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ tableView }) => {
  const [updateTableView, { loading, error }] = useMutation(
    UPDATE_TABLE_VIEW_MUTATION_GENERIC,
    {
      onCompleted: () => {
        toast.success('TableView updated')
        navigate(routes.tableViews())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input, id) => {
    updateTableView({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit TableView {tableView?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <TableViewForm
          tableView={tableView}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
