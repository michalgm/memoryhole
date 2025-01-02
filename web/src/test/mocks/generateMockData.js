import { visit } from 'graphql'
import { cloneDeep, merge } from 'lodash'

import { fragmentRegistry } from '@redwoodjs/web/apollo'

import * as generatedMocks from './generated'

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
export const generateMockData = (mockMethod, fragmentName, overrides = []) => {
  const fragment = fragmentRegistry.lookup(fragmentName)
  const fields = extractFields(fragment)
  const mockData = filterFields(generatedMocks[mockMethod]({}), fields)
  return overrides.map((override) => {
    return merge(cloneDeep(mockData), override)
  })
}
