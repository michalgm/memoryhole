import React from 'react'

import { ListItemText } from '@mui/material'

import dayjs from '../../../../api/src/lib/day'

import Autocomplete from './Autocomplete'

const autocompleteProps = {
  getOptionLabel: (option) => option?.arrestee?.search_display_field || '',
  renderOption: (
    props,
    { id, arrestee: { search_display_field }, date, arrest_city }
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

const query = {
  model: 'arrest',
  orderBy: {
    updated_at: 'desc',
  },
  take: 10,
}

const ArrestChooser = ({
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
      model="arrest"
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

export default ArrestChooser
