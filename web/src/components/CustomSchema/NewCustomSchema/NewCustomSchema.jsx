import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import CustomSchemaForm from 'src/components/CustomSchema/CustomSchemaForm'

const CREATE_CUSTOM_SCHEMA_MUTATION = gql`
  mutation CreateCustomSchemaMutation($input: CreateCustomSchemaInput!) {
    createCustomSchema(input: $input) {
      id
    }
  }
`

const NewCustomSchema = () => {
  const [createCustomSchema, { loading, error }] = useMutation(
    CREATE_CUSTOM_SCHEMA_MUTATION,
    {
      onCompleted: () => {
        toast.success('CustomSchema created')
        navigate(routes.customSchemata())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input) => {
    createCustomSchema({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New CustomSchema</h2>
      </header>
      <div className="rw-segment-main">
        <CustomSchemaForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewCustomSchema
