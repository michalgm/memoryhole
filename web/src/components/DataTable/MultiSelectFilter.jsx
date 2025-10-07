import React, { useState } from 'react'

import { Add, FilterList, Remove } from '@mui/icons-material'
import {
  Checkbox,
  Chip,
  FormControl,
  Input,
  InputAdornment,
  ListItemText,
  MenuItem,
  Select,
} from '@mui/material'
import { Box } from '@mui/system'

const MultiSelectFilter = ({ column, options }) => {
  const filterValue = column.getFilterValue() || { include: [], exclude: [] }
  const [filterState, setFilterState] = useState(filterValue)

  const handleChange = (option) => {
    setFilterState((prev) => {
      const include = prev.include || []
      const exclude = prev.exclude || []
      let newState
      if (include.includes(option)) {
        // Move from "include" to "neutral" (indeterminate)
        newState = { ...prev, include: include.filter((t) => t !== option) }
      } else if (exclude.includes(option)) {
        // Move from "exclude" to "include"
        newState = {
          ...prev,
          exclude: exclude.filter((t) => t !== option),
          include: [...include, option],
        }
      } else {
        // Move from "neutral" (indeterminate) to "exclude"
        newState = { ...prev, exclude: [...exclude, option] }
      }
      column.setFilterValue(newState)
      return newState
    })
  }

  return (
    <FormControl fullWidth size="x-small">
      <Select
        multiple
        value={[...filterState.include, ...filterState.exclude]}
        // sx={{ height: 'auto' }}
        sx={{ '& .MuiInputBase-input.MuiSelect-select': { height: 'auto' } }}
        renderValue={() => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {filterState.include?.map((tag) => (
              <Chip size="small" key={tag} label={tag} icon={<Add />} />
            ))}
            {filterState.exclude?.map((tag) => (
              <Chip size="small" key={tag} label={tag} icon={<Remove />} />
            ))}
          </Box>
        )}
        input={
          <Input
            label=""
            startAdornment={
              <InputAdornment position="start">
                <FilterList />
              </InputAdornment>
            }
          />
        }
        variant="standard"
      >
        {options.map((option) => {
          const isIncluded = filterState.include.includes(option)
          const isExcluded = filterState.exclude.includes(option)
          return (
            <MenuItem
              key={option}
              value={option}
              onClick={() => handleChange(option)}
            >
              <Checkbox
                checked={isIncluded}
                indeterminate={!isExcluded && !isIncluded}
              />
              <ListItemText primary={option} />
            </MenuItem>
          )
        })}
        {/* <MenuItem onClick={applyFilter}>
          <ListItemText primary="Apply Filter" />
        </MenuItem> */}
      </Select>
    </FormControl>
  )
}

export default MultiSelectFilter
