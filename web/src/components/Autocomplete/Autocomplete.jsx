import { memo, useCallback, useEffect, useMemo, useState } from 'react'

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

const ARRESTEE_QUERY = gql`
  query lookupArrestNames($search: String!, $params: QueryParams!) {
    searchArrestNames(search: $search, params: $params) {
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

const Autocomplete = ({
  name,
  label,
  textFieldProps,
  options: staticOptions,
  autocompleteProps: defaultAutocompleteProps,
  storeFullObject = false,
  query: inputQuery,
  value,
  onChange,
  helperText,
  isRHF = false,
  transformOptions,
  ...props
}) => {
  const query = useMemo(
    () => ({
      model: inputQuery?.model,
      searchField: inputQuery?.searchField,
      select: inputQuery?.select,
      orderBy: inputQuery?.orderBy,
      take: inputQuery?.take,
    }),
    [
      inputQuery?.model,
      inputQuery?.searchField,
      inputQuery?.select,
      inputQuery?.orderBy,
      inputQuery?.take,
    ]
  )

  const gqlQuery = query?.model === 'arrest' ? ARRESTEE_QUERY : DYNAMIC_QUERY

  const currentValue = value
  const displayError = useDisplayError()
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
  const [searchQuery, { loading }] = useLazyQuery(gqlQuery, {
    onError: displayError,
  })

  const handleSearch = useCallback(
    async (searchTerm = '') => {
      if (!query || staticOptions) return

      const { select, orderBy, model, searchField, take = 10 } = query
      const params = {
        orderBy,
        select,
        take,
      }
      const variables =
        query.model === 'arrest'
          ? { search: searchTerm, params }
          : {
              model,
              params: {
                ...params,
                where: {
                  [searchField]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                  },
                },
              },
            }
      const result = await searchQuery({
        variables,
      })

      const options =
        result.data[
          query.model === 'arrest' ? 'searchArrestNames' : 'dynamicModelQuery'
        ] || []
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

export default memo(Autocomplete)
