import { ListItemText } from '@mui/material'

import { displayItemProps } from 'src/lib/utils'

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
  renderOption: (props, item) => {
    const { id } = item.arrestee
    const { title, subtitle } = displayItemProps({ item, type: 'arrest' })
    return (
      <li {...props} key={id}>
        <ListItemText primary={title} secondary={subtitle} />
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
