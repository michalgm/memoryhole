import { useState } from 'react'

import { gql, useLazyQuery } from '@apollo/client'
import { Search } from '@mui/icons-material'
import {
  Autocomplete,
  Box,
  InputAdornment,
  TextField,
  Typography,
  alpha,
} from '@mui/material'

import { navigate } from '@redwoodjs/router'

import dayjs from '../../../../api/src/lib/day'

export const SEARCH_ARRESTS = gql`
  query searchArrestNames($search: String!) {
    arrest: searchArrestNames(search: $search) {
      id
      arrestee {
        display_field
      }
      date
      arrest_city
    }
  }
`
function QuickSearch(props) {
  const [searchValue, setSearchValue] = useState('')
  const [value, setValue] = useState('')
  const [results, setResults] = useState([])

  const [searchArrests, { loading }] = useLazyQuery(SEARCH_ARRESTS, {
    onCompleted: (data) => {
      setResults(data.arrest)
    },
  })

  const handleInputChange = (event, value) => {
    setSearchValue(value)
    if (value.length) {
      searchArrests({ variables: { search: searchValue } }) // Refetch the query with new variable
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
        // isOptionEqualToValue={(option, value) => console.log({option, value}) || option.id && value}
        // value={searchValue}
        getOptionLabel={(option) => option.display_field || ''} // Unique identifier, not displayed
        onInputChange={handleInputChange}
        filterOptions={(x) => x}
        // value={(_, value) => setValue(value)}
        onChange={(event, value, reason) => {
          setValue(value)
          if (value) {
            navigate(`/arrestee-arrest/${value.id}`)
            setResults([])
            setSearchValue('')
            setValue('')
          }
        }}
        renderOption={(
          props,
          { id, arrestee: { display_field }, date, arrest_city }
        ) => {
          const subtitle = `${date ? dayjs(date).format('L') : ''}${
            date && arrest_city ? ' - ' : ''
          }${arrest_city ? arrest_city : ''}`
          return (
            <li {...props} key={id}>
              <div>
                <Typography>{display_field}</Typography>
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
            sx={{
              // borderRadius: 5,
              backgroundColor: alpha('#fff', 0.65),
            }}
            // InputProps={{
            //   startAdornment: (
            //     <InputAdornment position="start">
            //       <Search />
            //     </InputAdornment>
            //   ),
            // }}
            placeholder="Search arrests..."
            variant="outlined"
          />
        )}
      />
    </Box>
  )
}

export default QuickSearch
