import { db } from 'src/lib/db'

import { bulkUpdateArrests, updateArrest } from './arrests'

describe('bulk arrestee custom_fields update', () => {
  scenario('merges custom_fields for multiple arrests', async (scenario) => {
    mockCurrentUser({ name: 'Rob', id: 1 })
    // Set up initial custom_fields for both arrests
    await updateArrest({
      id: scenario.arrest.one.id,
      input: { custom_fields: { foo: 'bar', bar: 'baz' } },
    })
    await updateArrest({
      id: scenario.arrest.two.id,
      input: { custom_fields: { alpha: 'beta' } },
    })

    // Bulk update: should merge, not overwrite
    await bulkUpdateArrests({
      ids: [scenario.arrest.one.id, scenario.arrest.two.id],
      input: { custom_fields: { foo: 'baz', newField: 123 } },
    })

    const result1 = await db.arrest.findUnique({
      where: { id: scenario.arrest.one.id },
    })
    const result2 = await db.arrest.findUnique({
      where: { id: scenario.arrest.two.id },
    })
    expect(result1.custom_fields).toEqual({
      foo: 'baz',
      bar: 'baz',
      test: true,
      custom: 'yes',
      newField: 123,
    })
    expect(result2.custom_fields).toEqual({
      alpha: 'beta',
      foo: 'baz',
      newField: 123,
    })
  })

  scenario(
    'merges custom_fields for nested arrestees in bulk',
    async (scenario) => {
      mockCurrentUser({ name: 'Rob', id: 1 })
      // Set up initial arrestee custom_fields for both arrests
      await updateArrest({
        id: scenario.arrest.one.id,
        input: { arrestee: { custom_fields: { foo: 'bar', bar: 'baz' } } },
      })
      await updateArrest({
        id: scenario.arrest.two.id,
        input: { arrestee: { custom_fields: { alpha: 'beta' } } },
      })
      // Bulk update: should merge, not overwrite
      await bulkUpdateArrests({
        ids: [scenario.arrest.one.id, scenario.arrest.two.id],
        input: { arrestee: { custom_fields: { foo: 'baz', newField: 123 } } },
      })
      const result1 = await db.arrestee.findUnique({
        where: { id: scenario.arrest.one.arrestee_id },
      })
      const result2 = await db.arrestee.findUnique({
        where: { id: scenario.arrest.two.arrestee_id },
      })
      expect(result1.custom_fields).toEqual({
        foo: 'baz',
        bar: 'baz',
        test: true,
        custom: 'yes',
        newField: 123,
      })
      expect(result2.custom_fields).toEqual({
        alpha: 'beta',
        newField: 123,
        custom: 'yes',
        test: true,
        foo: 'baz',
      })
    }
  )

  scenario(
    'merges non-overlapping custom_fields keys without loss',
    async (scenario) => {
      mockCurrentUser({ name: 'Rob', id: 1 })
      await updateArrest({
        id: scenario.arrest.one.id,
        input: { custom_fields: { foo: 'bar' } },
      })
      await bulkUpdateArrests({
        ids: [scenario.arrest.one.id],
        input: { custom_fields: { newKey: 'newValue' } },
      })
      const result = await db.arrest.findUnique({
        where: { id: scenario.arrest.one.id },
      })
      expect(result.custom_fields).toMatchObject({
        foo: 'bar',
        newKey: 'newValue',
      })
    }
  )

  scenario(
    'does not overwrite custom_fields when input is null or undefined',
    async (scenario) => {
      mockCurrentUser({ name: 'Rob', id: 1 })
      await updateArrest({
        id: scenario.arrest.one.id,
        input: { custom_fields: { foo: 'bar' } },
      })
      await expect(
        bulkUpdateArrests({
          ids: [scenario.arrest.one.id],
          input: { custom_fields: null },
        })
      ).rejects.toThrow('Arrest.custom_fields must be an object')

      await bulkUpdateArrests({
        ids: [scenario.arrest.one.id],
        input: {}, // no custom_fields key
      })
      const resultUndefined = await db.arrest.findUnique({
        where: { id: scenario.arrest.one.id },
      })
      expect(resultUndefined.custom_fields).toMatchObject({ foo: 'bar' })
    }
  )

  scenario(
    'does not clear custom_fields when updating with empty object',
    async (scenario) => {
      mockCurrentUser({ name: 'Rob', id: 1 })
      await updateArrest({
        id: scenario.arrest.one.id,
        input: { custom_fields: { foo: 'bar', bar: 'baz' } },
      })
      await bulkUpdateArrests({
        ids: [scenario.arrest.one.id],
        input: { custom_fields: {} },
      })
      const result = await db.arrest.findUnique({
        where: { id: scenario.arrest.one.id },
      })
      expect(result.custom_fields).toMatchObject({ foo: 'bar', bar: 'baz' })
    }
  )

  scenario(
    'merges custom_fields for records with and without existing data',
    async (scenario) => {
      mockCurrentUser({ name: 'Rob', id: 1 })
      // one has custom_fields, two does not
      await updateArrest({
        id: scenario.arrest.one.id,
        input: { custom_fields: { foo: 'bar' } },
      })
      await updateArrest({
        id: scenario.arrest.two.id,
        input: {}, // no custom_fields
      })
      await bulkUpdateArrests({
        ids: [scenario.arrest.one.id, scenario.arrest.two.id],
        input: { custom_fields: { newKey: 'newValue' } },
      })
      const result1 = await db.arrest.findUnique({
        where: { id: scenario.arrest.one.id },
      })
      const result2 = await db.arrest.findUnique({
        where: { id: scenario.arrest.two.id },
      })
      expect(result1.custom_fields).toMatchObject({
        foo: 'bar',
        newKey: 'newValue',
      })
      expect(result2.custom_fields).toMatchObject({ newKey: 'newValue' })
    }
  )

  scenario(
    'merges both arrest and arrestee custom_fields in one bulk update',
    async (scenario) => {
      mockCurrentUser({ name: 'Rob', id: 1 })
      await updateArrest({
        id: scenario.arrest.one.id,
        input: {
          custom_fields: { foo: 'bar' },
          arrestee: { custom_fields: { alpha: 'beta' } },
        },
      })
      await bulkUpdateArrests({
        ids: [scenario.arrest.one.id],
        input: {
          custom_fields: { newKey: 'arrest' },
          arrestee: { custom_fields: { newKey: 'arrestee' } },
        },
      })
      const arrest = await db.arrest.findUnique({
        where: { id: scenario.arrest.one.id },
      })
      const arrestee = await db.arrestee.findUnique({
        where: { id: scenario.arrest.one.arrestee_id },
      })
      expect(arrest.custom_fields).toMatchObject({
        foo: 'bar',
        newKey: 'arrest',
      })
      expect(arrestee.custom_fields).toMatchObject({
        alpha: 'beta',
        newKey: 'arrestee',
      })
    }
  )
})
