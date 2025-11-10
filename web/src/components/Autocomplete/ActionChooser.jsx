import { ListItemText } from '@mui/material'

import dayjs from 'src/lib/dayjs'

import Autocomplete from './Autocomplete'

const QUERY = gql`
  query searchActions($search: String!) {
    searchActions(search: $search) {
      id
      name
      start_date
      city
      jurisdiction
    }
  }
`

const autocompleteProps = {
  getOptionLabel: (option) => option?.name || '',
  renderOption: (props, { id, start_date, city, jurisdiction, name }) => {
    const date = start_date && dayjs(start_date).tz().format('L LT')
    const location = city || jurisdiction
    return (
      <li {...props} key={id}>
        <ListItemText
          primary={name}
          secondary={
            <>
              {date}
              {date && location && <br />}
              {location}
            </>
          }
        />
      </li>
    )
  },
}
const ActionChooser = (props) => {
  return (
    <Autocomplete
      query={QUERY}
      storeFullObject
      autocompleteProps={autocompleteProps}
      {...props}
    />
  )
}

export default ActionChooser
