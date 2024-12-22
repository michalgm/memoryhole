import { ListItemText } from '@mui/material'

import Autocomplete from './Autocomplete'

const QUERY = gql`
  query searchUsers($search: String!) {
    searchUsers(search: $search) {
      id
      name
      email
    }
  }
`

const autocompleteProps = {
  getOptionLabel: (option) => option?.name || '',
  renderOption: (props, { id, name, email }) => {
    return (
      <li {...props} key={id}>
        <ListItemText primary={name} secondary={email} />
      </li>
    )
  },
}

const UserChooser = (props) => {
  return (
    <Autocomplete
      query={QUERY}
      storeFullObject
      autocompleteProps={autocompleteProps}
      {...props}
    />
  )
}

export default UserChooser
