import { schema } from 'src/lib/FieldSchemas'

import DataTable from '../DataTable/DataTable'

export const QUERY = gql`
  query FindDocketSheetQuery(
    $jurisdiction: String!
    $report_type: String!
    $include_contact: Boolean
    $date: DateTime!
    $days: Int!
  ) {
    docketSheet: docketSheetSearch(
      date: $date
      days: $days
      report_type: $report_type
      jurisdiction: $jurisdiction
      include_contact: $include_contact
    ) {
      id
      jurisdiction
      citation_number
      charges
      date

      custom_fields
      arrestee {
        last_name
        first_name
        preferred_name
        pronoun
        dob
        phone_1
        phone_2
        email
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  docketSheet,
  queryResult: { refetch },

  include_contact,
}) => {
  const contact_fields = include_contact
    ? ['arrestee.phone_1', 'arrestee.phone_2', 'arrestee.email']
    : []
  const displayColumns = [
    'arrestee.last_name',
    'arrestee.first_name',
    'arrestee.preferred_name',
    'arrestee.pronoun',
    ...contact_fields,
    'date',
    'citation_number',
    'custom_fields.jail_id',
    'custom_fields.docket_number',
    'arrestee.dob',
    'custom_fields.next_court_date',
    'custom_fields.next_court_location',
    'charges',
    'custom_fields.lawyer',
    'custom_fields.bail_amount',
    'custom_fields.case_status',
    'custom_fields.release_type',
  ]

  const docketSchema = Object.keys(schema).reduce((acc, key) => {
    if (displayColumns.includes(key)) {
      acc[key] = schema[key]
    }
    return acc
  }, [])

  return (
    <DataTable
      data={docketSheet}
      schema={docketSchema}
      refetch={refetch}
      displayColumns={displayColumns}
      tableProps={{
        enablePagination: false,
        enableFilters: false,
        enableColumnActions: false,
        enableHiding: false,
        enableBottomToolbar: false,
      }}
      type="docket"
    />
  )
}
