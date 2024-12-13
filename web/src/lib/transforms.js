import { get, reduce, set } from 'lodash-es'

import dayjs from '../../../api/src/lib/day'

const dateTransformer = (value) => {
  if (!value) return null
  const date = dayjs(value)
  return date.isValid() ? date : null
}

const transformers = {
  date: dateTransformer,
  'date-time': dateTransformer,
}

export const transformData = (data, schema = {}) => {
  if (!data) {
    console.warn('No data provided to transform')
    return {}
  }

  const buildNewObject = (schema, originalData) =>
    reduce(
      schema,
      (result, params = {}, path) => {
        const transformer = transformers[params.field_type]
        const value = get(originalData, path, params.default ?? undefined)
        set(result, path, transformer ? transformer(value) : value)
        return result
      },
      {}
    )
  // console.log(id || data?.id, init, buildNewObject(schema, data))
  return buildNewObject(schema, data)
}
