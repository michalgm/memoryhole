import {
  arrestee,
  arrestees,
  createArrestee,
  deleteArrestee,
  updateArrestee,
  updateDisplayField,
} from './arrestees'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('arrestees', () => {
  scenario('returns all arrestees', async (scenario) => {
    const result = await arrestees()

    expect(result.length).toEqual(Object.keys(scenario.arrestee).length)
  })

  scenario('returns a single arrestee', async (scenario) => {
    const result = await arrestee({ id: scenario.arrestee.one.id })

    expect(result).toEqual(scenario.arrestee.one)
  })

  scenario('creates a arrestee', async () => {
    const result = await createArrestee({
      input: { first_name: 'String', search_field: 'String' },
    })

    expect(result.first_name).toEqual('String')
    expect(result.search_field).toEqual('String')
  })

  scenario('updates a arrestee', async (scenario) => {
    const original = await arrestee({
      id: scenario.arrestee.one.id,
    })
    const result = await updateArrestee({
      id: original.id,
      input: { last_name: 'String2' },
    })

    expect(result.last_name).toEqual('String2')
  })

  scenario('deletes a arrestee', async (scenario) => {
    const original = await deleteArrestee({
      id: scenario.arrestee.one.id,
    })
    const result = await arrestee({ id: original.id })

    expect(result).toBe(null)
  })
})

describe('updateDisplayField', () => {
  test('updates display field with all name components', () => {
    const arrestee = {
      first_name: 'John',
      last_name: 'Doe',
      preferred_name: 'Johnny',
    }
    updateDisplayField(arrestee)
    expect(arrestee.display_field).toEqual('Johnny (John) Doe')
  })

  test('handles no preferred name', () => {
    const arrestee = {
      last_name: 'Doe',
      first_name: 'John',
    }
    updateDisplayField(arrestee)
    expect(arrestee.display_field).toEqual('John Doe')
  })

  test('handle first name ==  preferred name', () => {
    const arrestee = {
      last_name: 'Doe',
      first_name: 'John',
      preferred_name: 'John',
    }
    updateDisplayField(arrestee)
    expect(arrestee.display_field).toEqual('John Doe')
  })

  test('handle first name + last_name ==  preferred name', () => {
    const arrestee = {
      last_name: 'Doe',
      first_name: 'John',
      preferred_name: 'John Doe',
    }
    updateDisplayField(arrestee)
    expect(arrestee.display_field).toEqual('John Doe')
  })

  test('handle first name ==  preferred name with confidential', () => {
    const arrestee = {
      last_name: 'Doe',
      first_name: 'John',
      preferred_name: 'John',
      custom_fields: {
        legal_name_confidential: true,
      },
    }
    updateDisplayField(arrestee)
    expect(arrestee.display_field).toEqual('John *')
  })

  test('handle first name + last_name ==  preferred name with confidential', () => {
    const arrestee = {
      last_name: 'Doe',
      first_name: 'John',
      preferred_name: 'John Doe',
      custom_fields: {
        legal_name_confidential: true,
      },
    }
    updateDisplayField(arrestee)
    expect(arrestee.display_field).toEqual('John Doe *')
  })

  test('handles missing first name', () => {
    const arrestee = {
      last_name: 'Doe',
      preferred_name: 'Johnny',
    }
    updateDisplayField(arrestee)
    expect(arrestee.display_field).toEqual('Johnny Doe')
  })

  test('handles legal name confidential flag', () => {
    const arrestee = {
      first_name: 'John',
      last_name: 'Doe',
      preferred_name: 'Johnny',
      custom_fields: {
        legal_name_confidential: true,
      },
    }
    updateDisplayField(arrestee)
    expect(arrestee.display_field).toEqual('Johnny *')
  })

  test('handles search_display_field with legal name confidential flag', () => {
    const arrestee = {
      first_name: 'John',
      last_name: 'Doe',
      preferred_name: 'Johnny',
      custom_fields: {
        legal_name_confidential: true,
      },
    }
    updateDisplayField(arrestee, {}, true)
    expect(arrestee.display_field).toEqual('Johnny (John) Doe')
  })

  test('handles legal name confidential with preferred name containing space', () => {
    const arrestee = {
      first_name: 'John',
      last_name: 'Doe',
      preferred_name: 'Johnny Boy',
      custom_fields: {
        legal_name_confidential: true,
      },
    }
    updateDisplayField(arrestee)
    expect(arrestee.display_field).toEqual('Johnny Boy *')
  })

  test('merges with current data', () => {
    const current = {
      first_name: 'John',
      last_name: 'Doe',
      preferred_name: 'Johnny',
    }
    const arrestee = {
      last_name: 'Smith',
    }
    updateDisplayField(arrestee, current)
    expect(arrestee.display_field).toEqual('Johnny (John) Smith')
  })

  test('handles extra whitespace in names', () => {
    const arrestee = {
      first_name: '  John  ',
      last_name: '  Doe  ',
      preferred_name: '  Johnny  ',
    }
    updateDisplayField(arrestee)
    expect(arrestee.display_field).toEqual('Johnny (John) Doe')
  })

  test('returns "no name entered" when blank', () => {
    const arrestee = {
      first_name: '',
    }
    updateDisplayField(arrestee)
    expect(arrestee.display_field).toEqual('NO NAME ENTERED')
  })

  test('returns "no name entered" when blank', () => {
    const arrestee = {
      first_name: '',
      custom_fields: {
        legal_name_confidential: true,
      },
    }
    updateDisplayField(arrestee)
    expect(arrestee.display_field).toEqual('Confidential (No preferred name) *')
  })

  test('replaces last name in preferred name when not confidential', () => {
    const arrestee = {
      first_name: 'John',
      last_name: 'Doe',
      preferred_name: 'Johnny Doe',
    }
    updateDisplayField(arrestee)
    expect(arrestee.display_field).toEqual('Johnny (John) Doe')
  })

  test('does not update display field when no name fields are provided', () => {
    const arrestee = {
      age: 25,
      custom_fields: {
        other_field: 'value',
      },
    }
    updateDisplayField(arrestee)
    expect(arrestee.display_field).toBeUndefined()
  })
})
