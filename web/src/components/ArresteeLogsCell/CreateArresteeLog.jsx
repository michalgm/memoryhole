import { CheckboxElement, FormContainer, TextFieldElement } from 'react-hook-form-mui'

import { Button } from '@mui/material'
import dayjs from 'dayjs'
import { useMutation } from '@redwoodjs/web'

export const CREATE_LOG_MUTATION = gql`
  mutation CreateArresteeLogMutation($input: CreateLogInput!) {
    createLog(input: $input) {
      arrestee_id
      notes
      needs_followup
    }
  }
`

export const EDIT_LOG_MUTATION = gql`
  mutation EditArresteeLogMutation($id: Int!, $input: UpdateLogInput!) {
    updateLog(id: $id, input: $input) {
      id
      notes
      needs_followup
    }
  }
`

const CreateArresteeLog = ({arrestee_id}) => {
  const [createItem, { loading, error }] = useMutation(CREATE_LOG_MUTATION, {
    onCompleted: () => {
      // Handle successful item creation (e.g., redirect or display a message)
    },
  })
  const defaultValues = {
    arrestee_id,
    notes: '',
    needs_followup: false,
  }

  const onSubmit = (data) => {
    createItem({ variables: { input: {...data, arrestee_id} } })
  }

  return (
    <FormContainer defaultValues={defaultValues}  onSuccess={(data) => onSubmit(data)}>
      <Button  disabled={loading} type="submit" variant="contained">
        Save Log
      </Button>
      <CheckboxElement name="needs_followup"/>
      <TextFieldElement name="notes" multiline minRows={3} />
    </FormContainer>
  )
}
export default CreateArresteeLog
