import ArresteeLogs from './ArresteeLogs'

export const QUERY = gql`
  query FetchArresteeLogs($arrestee_id: Int!) {
    arresteeLogs: arresteeLogs(arrestee_id: $arrestee_id) {
      id
      # time
      type
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

export const beforeQuery = (props) => {
  return { variables: props, fetchPolicy: 'network-only' }
}

export const Loading = () => <div>Loading...</div>

// export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ arresteeLogs, arrestee_id, queryResult }) => {
  const refetch = () =>
    queryResult.refetch({ variables: queryResult.variables })
  return (
    <ArresteeLogs
      logs={arresteeLogs}
      arrestee_id={arrestee_id}
      refetch={refetch}
    />
  )
}

/* <>
    {showCreate ? (
      <CreateArresteeLog arrestee_id={arrestee_id} />
    ) : (
      <Button startIcon={<Add />} onClick={() => setShowCreate(true)}>
        Create new log
      </Button>
    )}
    {arresteeLogs.map((item) => {
      return (
        <Grid key={item.id} xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5">
                {dayjs(item.created_at).fromNow()} - {item.created_by.name}
              </Typography>
              {item.notes}
            </CardContent>
          </Card>
        </Grid>
      )
    })}
  </>
) }*/
