import React from 'react'

import { ListItemText } from '@mui/material'

import { SearchField } from '@redwoodjs/forms'

import Autocomplete from './Autocomplete'

const autocompleteProps = {
  getOptionLabel: (option) => option?.name || '',
  renderOption: (props, { id, name }) => {
    return (
      <li {...props} key={id}>
        <ListItemText primary={name} />
      </li>
    )
  },
}

const query = {
  model: 'user',
  searchField: 'name',
  orderBy: {
    name: 'desc',
  },
  take: 10,
}

const UserChooser = ({
  name,
  helperText,
  isRHF,
  onChange,
  value,
  textFieldProps,
  ...props
}) => {
  return (
    <Autocomplete
      name={name}
      model="user"
      label={props.label}
      helperText={helperText}
      query={query}
      isRHF={isRHF}
      onChange={onChange}
      value={value}
      storeFullObject
      textFieldProps={textFieldProps}
      autocompleteProps={autocompleteProps}
      {...props}
    />
  )
}

export default UserChooser
