import { ListItemText } from '@mui/material'

import dayjs from '../../../../api/src/lib/day'

import Autocomplete from './Autocomplete'

const QUERY = gql`
  query lookupArrestNames($search: String!) {
    searchArrests(search: $search) {
      id
      arrestee {
        id
        search_display_field
      }
      date
      arrest_city
    }
  }
`

const autocompleteProps = {
  getOptionLabel: (option) => option?.arrestee?.search_display_field || '',
  renderOption: (
    props,
    { arrestee: { id, search_display_field }, date, arrest_city }
  ) => {
    const subtitle = `${date ? dayjs(date).format('L') : ''}${
      date && arrest_city ? ' - ' : ''
    }${arrest_city ? arrest_city : ''}`
    return (
      <li {...props} key={id}>
        <ListItemText primary={search_display_field} secondary={subtitle} />
      </li>
    )
  },
}

const ArrestChooser = (props) => {
  return (
    <Autocomplete
      query={QUERY}
      storeFullObject
      autocompleteProps={autocompleteProps}
      {...props}
    />
  )
}

export default ArrestChooser
