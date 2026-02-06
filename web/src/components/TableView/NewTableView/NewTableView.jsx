import { navigate, routes } from '@cedarjs/router'
import { useMutation } from '@cedarjs/web'

import { toast } from '@cedarjs/web/toast'

import TableViewForm from 'src/components/TableView/TableViewForm'

const CREATE_TABLE_VIEW_MUTATION = gql`
  mutation CreateTableViewMutation($input: CreateTableViewInput!) {
    createTableView(input: $input) {
      id
    }
  }
`

const NewTableView = () => {
  const [createTableView, { loading, error }] = useMutation(
    CREATE_TABLE_VIEW_MUTATION,
    {
      onCompleted: () => {
        toast.success('TableView created')
        navigate(routes.tableViews())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input) => {
    createTableView({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New TableView</h2>
      </header>
      <div className="rw-segment-main">
        <TableViewForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewTableView
