import { CheckboxElement, FormContainer, FormProvider, TextFieldElement } from "react-hook-form-mui"
import { useMutation, useQuery } from "@redwoodjs/web"

import { Button } from "@mui/material"
import { CheckBox } from "@mui/icons-material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import dayjs from "dayjs"

const FETCH_QUERY = gql`
  query FetchArresteeLogs2($arrestee_id: Int!) {
    Logs: arresteeLogs(arrestee_id: $arrestee_id) {
      id
      time
      type
      notes
      needs_followup
      custom_fields
      created_at
      created_by {
        name
      }
      updated_at
      updated_by {
        name
      }
    }
  }
`

const CREATE_LOG_MUTATION = gql`
  mutation CreateArresteeLogMutation($input: CreateLogInput!) {
    createLog(input: $input) {
      id
      time
      type
      notes
      needs_followup
      custom_fields
    }
  }
`



const ArresteeLog = ({ arrestee_id }) => {
  console.log(arrestee_id)

const { data, refetch } = useQuery(FETCH_QUERY, { variables: { arrestee_id } })

  console.log(data)
const [createLog, { loading, error }] = useMutation(CREATE_LOG_MUTATION, {
  onCompleted: async () => {
    // setHasPosted(true)
    // setSaving(false)
    // setShowSuccess(true)
    // refresh()
    // navigate(routes.arresteeArrest({id: }))
  },
  refetchQueries: [{ query: FETCH_QUERY, variables: { arrestee_id } }],
  awaitRefetchQueries: true,
  onError: (error) => {
    setSaving(false)
    console.log(error.message)
    toast.error(error.message)
  },
})

// refetch()
  const onCreate = async (input, id, refresh) => {
    console.log(input)
    input.time = dayjs()
    input.arrestee_id = arrestee_id
    await createLog({ variables: { input, refresh } })
  }
  return (
    <FormContainer
      defaultValues={{ needs_followup: false }}
      onSuccess={onCreate}
    >
      <Grid2 container>
        <TextFieldElement name="notes" multiline />
        <CheckboxElement name="needs_followup" />
      </Grid2>
      <Button type="submit">Save</Button>
    </FormContainer>
  )
}

  export default ArresteeLog;
