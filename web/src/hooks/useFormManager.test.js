import { getChangedFields } from './useFormManager'

describe('getChangedFields', () => {
  describe('guard clauses', () => {
    it('returns input when dirtyFields is null', () => {
      const input = { name: 'Alice' }
      expect(getChangedFields(input, null)).toEqual(input)
    })

    it('returns input when dirtyFields is undefined', () => {
      const input = { name: 'Alice' }
      expect(getChangedFields(input, undefined)).toEqual(input)
    })

    it('returns input when dirtyFields is a non-object primitive', () => {
      const input = { name: 'Alice' }
      expect(getChangedFields(input, true)).toEqual(input)
    })
  })

  describe('flat objects', () => {
    it('returns empty object when no fields are dirty', () => {
      const input = { name: 'Alice', age: 30 }
      const dirtyFields = { name: false, age: false }
      expect(getChangedFields(input, dirtyFields)).toEqual({})
    })

    it('returns only dirty fields', () => {
      const input = { name: 'Alice', age: 30, city: 'NY' }
      const dirtyFields = { name: true, age: false }
      expect(getChangedFields(input, dirtyFields)).toEqual({ name: 'Alice' })
    })

    it('returns all fields when all are dirty', () => {
      const input = { name: 'Alice', age: 30 }
      const dirtyFields = { name: true, age: true }
      expect(getChangedFields(input, dirtyFields)).toEqual({
        name: 'Alice',
        age: 30,
      })
    })

    it('returns empty object when dirtyFields is empty', () => {
      const input = { name: 'Alice' }
      expect(getChangedFields(input, {})).toEqual({})
    })
  })

  describe('nested objects (recursive)', () => {
    it('recurses into a nested dirty object', () => {
      const input = { address: { street: '1 Main St', city: 'NY' } }
      const dirtyFields = { address: { street: true } }
      expect(getChangedFields(input, dirtyFields)).toEqual({
        address: { street: '1 Main St' },
      })
    })

    it('excludes nested fields that are not dirty', () => {
      const input = {
        address: { street: '1 Main St', city: 'NY', zip: '10001' },
      }
      const dirtyFields = { address: { city: true } }
      expect(getChangedFields(input, dirtyFields)).toEqual({
        address: { city: 'NY' },
      })
    })

    it('recurses multiple levels deep', () => {
      const input = { a: { b: { c: 'deep', d: 'also deep' } } }
      const dirtyFields = { a: { b: { c: true } } }
      expect(getChangedFields(input, dirtyFields)).toEqual({
        a: { b: { c: 'deep' } },
      })
    })

    it('mixes flat and nested dirty fields', () => {
      const input = { name: 'Alice', address: { city: 'NY', zip: '10001' } }
      const dirtyFields = { name: true, address: { zip: true } }
      expect(getChangedFields(input, dirtyFields)).toEqual({
        name: 'Alice',
        address: { zip: '10001' },
      })
    })

    it('omits a nested object entirely when none of its fields are dirty', () => {
      const input = { name: 'Alice', address: { city: 'NY' } }
      const dirtyFields = { name: true, address: { city: false } }
      expect(getChangedFields(input, dirtyFields)).toEqual({
        name: 'Alice',
        address: {},
      })
    })
  })

  describe('arrays', () => {
    it('treats an array in dirtyFields as a leaf and returns the full input array', () => {
      const input = { tags: ['a', 'b', 'c'] }
      const dirtyFields = { tags: [true, true] }
      expect(getChangedFields(input, dirtyFields)).toEqual({
        tags: ['a', 'b', 'c'],
      })
    })

    it('includes array field as-is regardless of which elements are dirty', () => {
      const input = {
        items: [
          { id: 1, name: 'x' },
          { id: 2, name: 'y' },
        ],
      }
      const dirtyFields = { items: [{ name: true }] }
      expect(getChangedFields(input, dirtyFields)).toEqual({
        items: [
          { id: 1, name: 'x' },
          { id: 2, name: 'y' },
        ],
      })
    })
  })

  describe('edge cases', () => {
    it('preserves null and undefined input values for dirty fields', () => {
      const input = { name: null, age: undefined }
      const dirtyFields = { name: true, age: true }
      expect(getChangedFields(input, dirtyFields)).toEqual({
        name: null,
        age: undefined,
      })
    })

    it('handles input fields that are missing (undefined)', () => {
      const input = { name: 'Alice' }
      const dirtyFields = { name: true, missing: true }
      expect(getChangedFields(input, dirtyFields)).toEqual({
        name: 'Alice',
        missing: undefined,
      })
    })
  })
})
