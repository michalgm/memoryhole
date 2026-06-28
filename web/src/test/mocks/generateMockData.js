import { visit } from 'graphql'
import { cloneDeep, merge } from 'lodash'

import { fragmentRegistry } from '@cedarjs/web/apollo'

import * as _fragments from 'src/lib/gql_fragments'

import * as generatedMocks from './generated'
export function transformGeneratedTypes(generated) {
  const { seedMocks: _seedMocks, ...mockGenerators } = generated
  return mockGenerators
}

const mockGenerators = transformGeneratedTypes(generatedMocks)

function extractFields(selectionSet) {
  const fields = {}

  visit(selectionSet, {
    Field(node) {
      fields[node.name.value] = node.selectionSet
        ? extractFields(node.selectionSet)
        : null
    },
  })

  return fields
}

function filterFields(data, fields) {
  if (Array.isArray(data)) {
    return data.map((item) => filterFields(item, fields))
  }

  if (typeof data !== 'object' || data === null) {
    return data
  }

  const result = {}

  for (const key of Object.keys(fields)) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      if (fields[key]) {
        // Recursively filter nested objects
        result[key] = filterFields(data[key], fields[key])
      } else {
        result[key] = data[key]
      }
    }
  }

  // Always preserve __typename
  if (data.__typename) {
    result.__typename = data.__typename
  }

  return result
}
export const generateMockData = (
  mockMethod,
  fragmentOrFields,
  overrides = []
) => {
  let fields
  if (typeof fragmentOrFields === 'string') {
    const fragment = fragmentRegistry.lookup(fragmentOrFields)
    if (!fragment) {
      console.warn(`Fragment "${fragmentOrFields}" not found`)
      return []
    }
    fields = extractFields(fragment)
  } else {
    fields = fragmentOrFields // plain object field spec, or null to skip filtering
  }

  const resolvedOverrides =
    typeof overrides === 'number' ? Array(overrides).fill({}) : overrides

  return resolvedOverrides.map((override) => {
    const mockData = mockGenerators[mockMethod]({})
    const filtered = fields
      ? filterFields(mockData, fields)
      : cloneDeep(mockData)
    return merge(filtered, override)
  })
}
