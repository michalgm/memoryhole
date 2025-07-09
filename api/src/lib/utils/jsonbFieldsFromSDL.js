// Utility to extract JSON fields from all SDL files using the GraphQL parser
import fs from 'fs'
import path from 'path'

import { parse } from 'graphql'

const SDL_DIR = path.resolve(__dirname, '../../graphql')

function extractJsonFieldsFromSDL(sdlString) {
  const ast = parse(sdlString)
  const map = {}
  for (const def of ast.definitions) {
    if (
      def.kind === 'ObjectTypeDefinition' ||
      def.kind === 'InputObjectTypeDefinition'
    ) {
      const modelName = def.name.value
      const jsonFields = []
      for (const field of def.fields || []) {
        // Accept both JSON and Json as type
        if (
          field.type.kind === 'NamedType' &&
          (field.type.name.value === 'JSON' || field.type.name.value === 'Json')
        ) {
          jsonFields.push(field.name.value)
        }
      }
      if (jsonFields.length > 0) {
        map[modelName] = jsonFields
      }
    }
  }
  return map
}

function getAllSDLJsonbFields() {
  const files = fs.readdirSync(SDL_DIR).filter((f) => f.endsWith('.sdl.js'))
  const result = {}
  for (const file of files) {
    // console.log(`Processing SDL file: ${file}`)
    const content = fs.readFileSync(path.join(SDL_DIR, file), 'utf8')
    // Extract the SDL string from the file (between gql` and `)
    const match = content.match(/(gql|import_graphql_tag.default)`([\s\S]*?)`/)
    if (!match) continue
    const sdlString = match[2]
    const map = extractJsonFieldsFromSDL(sdlString)
    for (const [model, fields] of Object.entries(map)) {
      if (!result[model]) result[model] = []
      // console.log(`Found JSON fields for model ${fields}`)
      result[model].push(...fields)
    }
  }
  // Remove duplicates
  for (const model in result) {
    result[model] = Array.from(new Set(result[model]))
  }
  return result
}

export const jsonbFields = getAllSDLJsonbFields()
console.log('JSONB FIELDS', jsonbFields)
