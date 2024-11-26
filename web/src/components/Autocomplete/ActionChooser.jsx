import React from 'react'

import { Typography, ListItemText } from '@mui/material'

import dayjs from '../../../../api/src/lib/day'

import Autocomplete from './Autocomplete'

const autocompleteProps = {
  getOptionLabel: (option) => {
    return option.name
  },
  renderOption: ({ key, ...props }, option) => (
    <li key={key} {...props}>
      <ListItemText
        primary={
          <Typography variant="body1" component="span">
            {option.name}
          </Typography>
        }
        secondary={
          option.start_date && (
            <Typography variant="body2" color="textSecondary">
              {dayjs(option.start_date).format('L LT')}
            </Typography>
          )
        }
      />
    </li>
  ),
}

const query = {
  model: 'action',
  orderBy: {
    start_date: 'desc',
  },
  searchField: 'name',
}

const ActionChooser = ({
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

export default ActionChooser
