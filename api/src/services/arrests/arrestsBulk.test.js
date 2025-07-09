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
})
