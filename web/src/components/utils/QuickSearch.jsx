import { useState } from 'react'

import { gql, useLazyQuery } from '@apollo/client'
import { Search } from '@mui/icons-material'
import {
  alpha,
  Autocomplete,
  Box,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'

import { navigate, routes } from '@cedarjs/router'

import { useApp } from 'src/lib/AppContext'
import { displayItemProps } from 'src/lib/utils'

export const SEARCH_ARRESTS = gql`
  query searchArrestNames($search: String!, $action_id: Int) {
    arrest: searchArrests(search: $search, action_id: $action_id) {
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
function QuickSearch() {
  const [searchValue, setSearchValue] = useState('')
  const [value, setValue] = useState('')
  const [results, setResults] = useState([])
  const { currentAction } = useApp()

  const [searchArrests, { loading }] = useLazyQuery(SEARCH_ARRESTS, {
    onCompleted: (data) => {
      setResults(data.arrest)
    },
  })
  const action_id = currentAction?.id !== -1 ? currentAction.id : null

  const handleInputChange = (event, value) => {
    setSearchValue(value)
    if (value.length) {
      searchArrests({
        variables: { search: value, action_id },
      })
    } else {
      setResults([])
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Autocomplete
        size="small"
        freeSolo
        autoHighlight
        loading={loading}
        options={results}
        blurOnSelect={true}
        clearOnBlur={true}
        value={value}
        open={true}
        onInputChange={handleInputChange}
        filterOptions={(x) => x}
        onChange={(event, value) => {
          setValue(value)
          if (value) {
            setResults([])
            setSearchValue('')
            setValue('')
            navigate(routes.arrest({ id: value.id }))
          }
        }}
        getOptionLabel={(option) => option.search_display_field || ''}
        renderOption={(props, item) => {
          const { title, subtitle } = displayItemProps({ item, type: 'arrest' })
          const { id } = item
          return (
            <li {...props} key={id}>
              <div>
                <Typography>{title}</Typography>
                <Typography color="GrayText" variant="subtitle2">
                  {subtitle}
                </Typography>
              </div>
            </li>
          )
        }}
        inputValue={searchValue}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            sx={{
              borderRadius: 1,
              backgroundColor: (theme) =>
                alpha(theme.palette.common.white, 0.2),
              input: { color: '#fff' }, // Text color for readability
              '& .MuiSvgIcon-root': {
                color: '#fff !important',
              },
            }}
            placeholder="Search arrests..."
            slotProps={{
              input: {
                disableUnderline: true,
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start" color="#fff">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
      />
    </Box>
  )
}

export default QuickSearch
