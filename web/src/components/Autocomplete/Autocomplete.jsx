import { memo, useCallback, useEffect, useMemo, useState } from 'react'

import { useLazyQuery } from '@apollo/client'
import {
  CircularProgress,
  InputAdornment,
  Autocomplete as MUIAutocomplete,
  TextField,
} from '@mui/material'
import { debounce, merge } from 'lodash-es'
import { AutocompleteElement, useFormContext } from 'react-hook-form-mui'

import { useDisplayError } from '../utils/SnackBar'

const mockQuery = gql`
  query NoOpQuery {
    __typename
  }
`

const getOperationName = (query) => {
  const def = query.definitions[0]
  const selection = def.selectionSet.selections[0]
  return selection.name.value
}

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
  const graphqlQuery = query || mockQuery
  const displayError = useDisplayError()
  const { getValues } = useFormContext() || {}
  const currentValue = isRHF && getValues && isRHF ? getValues()[name] : value
  const [options, setOptions] = useState(() => {
    if (currentValue && !staticOptions) {
      if (props.multiple && Array.isArray(currentValue)) {
        return currentValue
      }
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

  const [searchQuery, { loading }] = useLazyQuery(graphqlQuery, {
    onError: displayError,
  })

  const handleSearch = useCallback(
    async (searchTerm = '') => {
      if (!query || staticOptions) return
      const result = await searchQuery({ variables: { search: searchTerm } })
      const operationName = getOperationName(query)
      const options = result?.data?.[operationName] || []

      const transformedOptions = transformOptions
        ? transformOptions(options.map((o) => ({ ...o, label: o.name })))
        : options.map((o) => ({ ...o, label: o.name }))

      // Merge with current values if multiple
      if (props.multiple && Array.isArray(currentValue)) {
        const optionsMap = new Map([
          ...transformedOptions.map((o) => [o.id, o]),
          ...currentValue.map((v) => [v.id, v]),
        ])
        setOptions(Array.from(optionsMap.values()))
      } else {
        setOptions(transformedOptions)
      }
    },
    [
      query,
      staticOptions,
      searchQuery,
      transformOptions,
      currentValue,
      props.multiple,
    ]
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
      onChange && onChange(storeFullObject ? value : value?.id || null)
    },

    onInputChange: (_, value, reason) => {
      if (reason === 'input') {
        debouncedSearch(value)
      }
    },
    size: textFieldProps?.size || 'small',
    clearOnBlur: !props.multiple,
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
            endAdornment: (
              <InputAdornment position="end">
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

export default memo(Autocomplete)
