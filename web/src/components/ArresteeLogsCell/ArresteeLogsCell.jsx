import { Card, CardContent, CardHeader, Typography } from "@mui/material"

import dayjs from '../../../../api/src/lib/day'
export const QUERY = gql`
  query FetchArresteeLogs($arrestee_id: Int!) {
    arresteeLogs: arresteeLogs(arrestee_id: $arrestee_id) {
      id
      # time
      # type
      notes
      needs_followup
      # custom_fields
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

// const CREATE_LOG_MUTATION = gql`
//   mutation CreateArresteeLogMutation($input: CreateLogInput!) {
//     createLog(input: $input) {
//       id
//       time
//       type
//       notes
//       needs_followup
//       custom_fields
//     }
//   }
// `
export const beforeQuery = (props) => {
  return { variables: props, fetchPolicy: 'network-only' }
}

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ arresteeLogs }) => {
  return arresteeLogs.map(item => {
    console.log(item)
        return <Card key={item.id}>
          <CardContent>
          <Typography variant="h5">
              {dayjs(item.created_at).fromNow()} - {item.created_by.name}
          </Typography>
            {item.notes}
          </CardContent>
        </Card>
      } )
}
