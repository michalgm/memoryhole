import { useMemo, useState, useEffect, useCallback } from 'react'

import { useLazyQuery } from '@apollo/client'
import {
  CircularProgress,
  InputAdornment,
  Autocomplete as MUIAutocomplete,
  TextField,
} from '@mui/material'
import { debounce, merge } from 'lodash-es'
import { AutocompleteElement } from 'react-hook-form-mui'

import { useDisplayError } from '../utils/SnackBar'

const DYNAMIC_QUERY = gql`
  query DynamicQuery($model: String!, $params: QueryParams!) {
    dynamicModelQuery(model: $model, params: $params)
  }
`

const Autocomplete = ({
  name,
  label,
  textFieldProps,
  options: staticOptions,
  autocompleteProps: defaultAutocompleteProps,
  storeFullObject = false,
  query,
  value,
  onChange,
  helperText,
  isRHF = false,
  transformOptions,
  ...props
}) => {
  const currentValue = value
  const displayError = useDisplayError()
  const [options, setOptions] = useState(() => {
    if (currentValue && !staticOptions) {
      return [
        {
          ...(currentValue.id ? currentValue : { id: currentValue }),
          label: currentValue.name,
        },
      ]
    }
    const initialOptions = staticOptions || []

    return transformOptions ? transformOptions(initialOptions) : initialOptions
  })
  const [searchQuery, { loading }] = useLazyQuery(DYNAMIC_QUERY, {
    onError: displayError,
  })

  const handleSearch = useCallback(
    async (searchTerm) => {
      if (!query || staticOptions) return
      const { select, orderBy, model, searchField, take = 10 } = query
      const params = {
        where: {
          [searchField]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        orderBy,
        select,
        take,
      }

      const result = await searchQuery({
        variables: { model, params },
      })

      const options = result.data?.dynamicModelQuery || []
      const transformedOptions = transformOptions
        ? transformOptions(options.map((o) => ({ ...o, label: o.name })))
        : options.map((o) => ({ ...o, label: o.name }))

      setOptions(transformedOptions)
    },
    [query, staticOptions, searchQuery, transformOptions]
  )

  const debouncedSearch = useMemo(
    () => debounce((searchTerm) => handleSearch(searchTerm), 300),
    [handleSearch]
  )

  useEffect(() => {
    debouncedSearch()
  }, [debouncedSearch])

  const autocompleteProps = {
    isOptionEqualToValue: (option = {}, value) => {
      return option.id === value || option.id === value?.id
    },
    getOptionLabel: (option) => option.label || '',
    onChange: (e, value) => {
      onChange(storeFullObject ? value : value?.id || null)
    },

    onInputChange: (_, value, reason) => {
      if (reason === 'input') {
        debouncedSearch(value)
      }
    },
    size: textFieldProps?.size || 'small',
    ...defaultAutocompleteProps,
  }
  delete autocompleteProps.inputProps
  delete autocompleteProps.helperText
  if (isRHF) {
    return (
      <AutocompleteElement
        name={name}
        label={label}
        options={options}
        textFieldProps={textFieldProps}
        autocompleteProps={autocompleteProps}
        helperText={helperText}
        loading={loading}
        {...props}
      />
    )
  }

  return (
    <MUIAutocomplete
      name={name}
      label={label}
      options={options}
      value={currentValue}
      renderInput={(params) => {
        const mergedProps = merge(params, textFieldProps)
        if (loading) {
          mergedProps.InputProps = {
            ...mergedProps.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <CircularProgress color="inherit" size={20} />
              </InputAdornment>
            ),
          }
        }
        return (
          <TextField
            {...params}
            {...mergedProps}
            error={props.error}
            helperText={helperText}
          />
        )
      }}
      {...autocompleteProps}
      {...props}
    />
  )
}

export default Autocomplete
