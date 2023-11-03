import { Autocomplete, Box, InputAdornment, TextField, alpha } from '@mui/material'
import { gql, useLazyQuery } from '@apollo/client'

import { Search } from '@mui/icons-material'
import { navigate } from '@redwoodjs/router'
import  {useState} from 'react'

export const SEARCH_ARRESTS = gql`
  query searchArrestNames($search: String!) {
    arrest: searchArrestNames(search: $search) {
      id
      search,
      date,
    }
  }
`
function QuickSearch(props) {
  const [searchValue, setSearchValue] = useState('')
  const [value, setValue] = useState('')
  const [results, setResults] = useState([])

   const [searchArrests, { loading }] = useLazyQuery(
     SEARCH_ARRESTS,
     {
       onCompleted: (data) => {
         console.log(data.arrest)
         setResults(data.arrest)
       },
     }
   )

  const handleInputChange = (event, value) => {
     setSearchValue(value)
     if (value.length > 2) {
       searchArrests({variables: { search: searchValue }}) // Refetch the query with new variable
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
        // isOptionEqualToValue={(option, value) => console.log({option, value}) || option.id && value}
        // value={searchValue}
        getOptionLabel={(option) => option.display_field || ''} // Unique identifier, not displayed
        onInputChange={handleInputChange}
        filterOptions={(x) => x}
        // value={(_, value) => setValue(value)}
        onChange={(event, value, reason) => {
          setValue(value)
          console.log('!!!', reason)
          if (value) {
            navigate(`/arrestee-arrest/${value.id}`)
            setResults([])
            setSearchValue('')
            setValue('')
          }
        }}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.display_field}
          </li>
        )}
        inputValue={searchValue}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{
              borderRadius: 5,
              backgroundColor: alpha('#fff', 0.65),
            }}
            // InputProps={{
            //   startAdornment: (
            //     <InputAdornment position="start">
            //       <Search/>
            //     </InputAdornment>
            //   ),
            // }}
            // placeholder="Search arrests..."
            variant="outlined"
          />
        )}
      />
    </Box>
  )
}

export default QuickSearch
