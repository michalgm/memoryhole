import { useMemo, useState, useEffect, useCallback } from 'react'

import { useLazyQuery } from '@apollo/client'
import { debounce } from 'lodash'
import { AutocompleteElement, useFormContext } from 'react-hook-form-mui'

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
  ...props
}) => {
  const { setValue, getValues } = useFormContext()
  const currentValue = getValues(name)
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
    return staticOptions || []
  })
  const [searchQuery] = useLazyQuery(DYNAMIC_QUERY, { onError: displayError })
  // console.log(query, currentValue, options)

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

      setOptions(options.map((o) => ({ ...o, label: o.name })))
    },
    [query, staticOptions, searchQuery]
  )

  useEffect(() => {
    if (!query || staticOptions) return

    handleSearch()
  }, [query, staticOptions, handleSearch])

  const debouncedSearch = useMemo(
    () => debounce((searchTerm) => handleSearch(searchTerm), 300),
    [handleSearch]
  )

  const autocompleteProps = {
    ...textFieldProps,
    isOptionEqualToValue: (option = {}, value) => {
      return option.id === value || option.id === value?.id
    },
    getOptionLabel: (option) => option.label || '',
    onChange: (e, value) => {
      setValue(name, storeFullObject ? value : value?.id || null)
    },

    onInputChange: (_, value, reason) => {
      if (reason === 'input' && value?.length > 2) {
        debouncedSearch(value)
      }
    },
    ...defaultAutocompleteProps,
  }
  delete autocompleteProps.inputProps
  delete autocompleteProps.helperText
  // console.log(name, options, currentValue)
  return (
    <AutocompleteElement
      name={name}
      label={label}
      options={options}
      textFieldProps={textFieldProps}
      autocompleteProps={autocompleteProps}
      {...props}
    />
  )
}

export default Autocomplete
