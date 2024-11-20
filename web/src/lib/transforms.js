import { get, set, flatMap, reduce } from 'lodash-es'

import dayjs from '../../../api/src/lib/day'

const transformers = {
  date: (value) => (value ? dayjs(value) : null),
  'date-time': (value) => (value ? dayjs(value) : null),
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
