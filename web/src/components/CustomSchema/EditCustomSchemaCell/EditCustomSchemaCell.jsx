import { navigate, routes } from '@redwoodjs/router'

import CustomSchemaForm from 'src/components/CustomSchema/CustomSchemaForm'
import { toast } from '@redwoodjs/web/toast'
import { useMutation } from '@redwoodjs/web'

export const QUERY = gql`
  query EditCustomSchemaById($id: Int!) {
    customSchema: customSchema(id: $id) {
      id
      table
      section
      schema
      updated_at
      updated_by_id
    }
  }
`
const UPDATE_CUSTOM_SCHEMA_MUTATION = gql`
  mutation UpdateCustomSchemaMutation(
    $id: Int!
    $input: UpdateCustomSchemaInput!
  ) {
    updateCustomSchema(id: $id, input: $input) {
      id
      table
      section
      schema
      updated_at
      updated_by_id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ customSchema }) => {
  const [updateCustomSchema, { loading, error }] = useMutation(
    UPDATE_CUSTOM_SCHEMA_MUTATION,
    {
      onCompleted: () => {
        toast.success('CustomSchema updated')
        navigate(routes.customSchemata())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input, id) => {
    updateCustomSchema({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit CustomSchema {customSchema?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <CustomSchemaForm
          customSchema={customSchema}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
