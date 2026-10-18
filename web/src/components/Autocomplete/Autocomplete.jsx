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

import { useDisplayError } from 'src/components/utils/SnackBar'
import { mockQuery } from 'src/lib/gql_fragments'

const getOperationName = (query) => {
  const def = query.definitions[0]
  const selection = def.selectionSet.selections[0]
  return selection.name.value
}

const compact = (values) =>
  (Array.isArray(values) ? values : []).filter((v) => v != null)

const isOptionEqualToValue = (option = {}, value) => {
  return option.id === value || option.id === value?.id
}

const Autocomplete = ({
  name,
  label,
  textFieldProps = {},
  options: staticOptions,
  autocompleteProps: defaultAutocompleteProps,
  storeFullObject = false,
  query,
  value,
  onChange,
  helperText,
  isRHF = false,
  transformOptions,
  error,
  placeholder,
  loading: externalLoading,
  ...props
}) => {
  const graphqlQuery = query || mockQuery
  const displayError = useDisplayError()
  const { getValues } = useFormContext() || {}
  // getValues(name) resolves dotted paths like 'shift.coordinators'
  const getCurrentValue = useCallback(
    () => (isRHF && getValues ? getValues(name) : value),
    [isRHF, getValues, name, value]
  )
  const currentValue = getCurrentValue()
  const [options, setOptions] = useState(() => {
    if (currentValue && !staticOptions) {
      if (props.multiple && Array.isArray(currentValue)) {
        return compact(currentValue)
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

      // Merge with current values if multiple, so selected values stay
      // matchable after a search replaces the options list
      const selected = getCurrentValue()
      if (props.multiple && Array.isArray(selected)) {
        const optionsMap = new Map([
          ...transformedOptions.map((o) => [o.id, o]),
          ...compact(selected)
            .filter((v) => typeof v === 'object')
            .map((v) => [v.id, v]),
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
      getCurrentValue,
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
    disabled: props.disabled,
    isOptionEqualToValue,
    getOptionLabel: (option) => option.label || '',
    onChange: (e, value) => {
      if (!onChange) return
      if (props.multiple) {
        onChange(compact(value).map((v) => (storeFullObject ? v : (v.id ?? v))))
      } else {
        onChange(storeFullObject ? value : value?.id || null)
      }
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
  textFieldProps.helperText = helperText
  textFieldProps.error = error
  textFieldProps.placeholder = placeholder

  if (isRHF) {
    // AutocompleteElement's default transform maps values it can't find in
    // options to undefined, which then gets saved as null in multiple mode
    const transform = props.multiple
      ? {
          input: (fieldValue) =>
            compact(fieldValue).map(
              (v) =>
                options.find((o) => isOptionEqualToValue(o, v)) ??
                (typeof v === 'object' ? v : { id: v, label: `${v}` })
            ),
          output: (_e, newValue) =>
            compact(newValue).map((v) =>
              props.matchId && typeof v === 'object' ? v.id : v
            ),
        }
      : undefined
    return (
      <AutocompleteElement
        name={name}
        label={label}
        options={options}
        textFieldProps={textFieldProps}
        autocompleteProps={autocompleteProps}
        helperText={helperText}
        loading={loading || externalLoading}
        transform={transform}
        {...props}
      />
    )
  }
  delete props.matchId
  textFieldProps.label = label

  return (
    <MUIAutocomplete
      name={name}
      label={label}
      options={options}
      value={currentValue}
      renderInput={(params) => {
        const mergedProps = merge(params, textFieldProps)
        if (loading || externalLoading) {
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
            error={error}
            helperText={helperText}
            placeholder={props.placeholder}
          />
        )
      }}
      {...autocompleteProps}
      {...props}
    />
  )
}

export default memo(Autocomplete)
