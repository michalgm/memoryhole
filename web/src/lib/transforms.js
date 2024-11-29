import { flatMap, get, reduce, set } from 'lodash-es'

import dayjs from '../../../api/src/lib/day'

const transformers = {
  date: (value) => {
    const date = dayjs(value)
    return date.isValid() ? date : null
  },
  'date-time': (value) => {
    const dateTime = dayjs(value)
    return dateTime.isValid() ? dateTime : null
  },
}

export const transformData = (data, fields) => {
  const fieldPaths = flatMap(fields, (section) =>
    section.fields.map((field) => [field[0], field[1]])
  )
  const buildNewObject = (paths, originalData) =>
    reduce(
      paths,
      (result, [path, params = {}]) => {
        let value = get(originalData, path)
        if ((value === undefined || value == null) && params.default) {
          value = params.default
        }
        if (value !== undefined && value !== null) {
          const transformer = transformers[params.field_type]
          if (transformer) {
            value = transformer(value)
          }
          set(result, path, value)
        }
        return result
      },
      {}
    )

  return buildNewObject(fieldPaths, data)
}
