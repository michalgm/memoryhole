import { useState } from 'react'

import { gql, useLazyQuery } from '@apollo/client'
import { Search } from '@mui/icons-material'
import {
  Autocomplete,
  Box,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'

import { navigate, routes } from '@redwoodjs/router'

import { useApp } from 'src/lib/AppContext'

import dayjs from '../../../../api/src/lib/day'

export const SEARCH_ARRESTS = gql`
  query searchArrestNames($search: String!, $params: QueryParams!) {
    arrest: searchArrestNames(search: $search, params: $params) {
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
        variables: { search: value, params: { where: { action_id } } },
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
        getOptionLabel={(option) => option.search_display_field || ''}
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
        renderOption={(
          props,
          { id, arrestee: { search_display_field }, date, arrest_city }
        ) => {
          const subtitle = `${date ? dayjs(date).format('L') : ''}${
            date && arrest_city ? ' - ' : ''
          }${arrest_city ? arrest_city : ''}`
          return (
            <li {...props} key={id}>
              <div>
                <Typography>{search_display_field}</Typography>
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
              backgroundColor: 'primary.light',
              input: { color: '#fff' }, // Text color for readability
              '& .MuiSvgIcon-root': {
                color: '#fff !important',
              },
            }}
            InputProps={{
              disableUnderline: true,
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start" color="#fff">
                  <Search />
                </InputAdornment>
              ),
            }}
            placeholder="Search arrests..."
          />
        )}
      />
    </Box>
  )
}

export default QuickSearch
