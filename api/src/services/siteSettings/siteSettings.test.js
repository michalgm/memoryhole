import { decrypt, isEncrypted } from 'src/lib/crypto'
import { db } from 'src/lib/db'

import {
  bulkUpsertSiteSetting,
  createSiteSetting,
  deleteSiteSetting,
  ENCRYPTED_SETTING_SENTINEL,
  sendTestEmail,
  siteSetting,
  siteSettings,
  updateSiteSetting,
  upsertSiteSetting,
} from './siteSettings'

jest.mock('src/lib/email', () => ({
  sendEmail: jest.fn().mockResolvedValue({}),
}))

describe('siteSettings', () => {
  scenario('returns all siteSettings', async (scenario) => {
    const result = await siteSettings()
    expect(result.length).toBeGreaterThanOrEqual(
      Object.keys(scenario.siteSetting).length
    )
  })

  scenario('returns a single siteSetting', async (scenario) => {
    const result = await siteSetting({ id: scenario.siteSetting.one.id })

    expect(result).toEqual(scenario.siteSetting.one)
  })

  scenario('creates a siteSetting', async () => {
    mockCurrentUser({ name: 'Rob', id: 1 })

    const result = await createSiteSetting({
      input: {
        id: 'default_restrictions',
        value: { operator: {}, coordinator: {}, admin: {} },
      },
    })

    expect(result.id).toEqual('default_restrictions')
    expect(result.value).toEqual({ operator: {}, coordinator: {}, admin: {} })
  })

  scenario('updates a siteSetting', async (scenario) => {
    mockCurrentUser({ name: 'Rob', id: 1 })
    const original = await siteSetting({
      id: scenario.siteSetting.one.id,
    })
    const result = await updateSiteSetting({
      id: original.id,
      input: { value: 'String2' },
    })
    expect(result.value).toEqual('String2')
    expect(result.updated_by_id).toEqual(1)
  })

  scenario('updates a siteSetting on upsert', async (scenario) => {
    mockCurrentUser({ name: 'Rob', id: 1 })

    const original = await siteSetting({
      id: scenario.siteSetting.one.id,
    })
    const result = await upsertSiteSetting({
      input: { id: original.id, value: 'String2' },
    })

    expect(result.value).toEqual('String2')
    expect(result.id).toEqual(original.id)
  })

  scenario('creates a siteSetting on upsert', async () => {
    mockCurrentUser({ name: 'Rob', id: 1 })

    const result = await upsertSiteSetting({
      input: { id: 'siteHelp', value: 'String3' },
    })

    expect(result.value).toEqual('String3')
    expect(result.id).toEqual('siteHelp')
  })

  scenario('deletes a siteSetting', async (scenario) => {
    const original = await deleteSiteSetting({
      id: scenario.siteSetting.one.id,
    })
    const result = await siteSetting({ id: original.id })

    expect(result).toEqual(null)
  })
})

describe('smtp_pass encryption', () => {
  beforeEach(() => {
    process.env.SETTINGS_ENCRYPTION_KEY =
      'a1b2c3d4e5f6a7b8a1b2c3d4e5f6a7b8a1b2c3d4e5f6a7b8a1b2c3d4e5f6a7b8'
    jest.clearAllMocks()
  })

  scenario('siteSettings returns sentinel for smtp_pass when set', async () => {
    await db.siteSetting.create({ data: { id: 'smtp_pass', value: 'stored-value' } })

    const result = await siteSettings()
    const setting = result.find((s) => s.id === 'smtp_pass')

    expect(setting.value).toEqual(ENCRYPTED_SETTING_SENTINEL)
  })

  scenario(
    'siteSettings returns empty string for smtp_pass when not set',
    async () => {
      const result = await siteSettings()
      const setting = result.find((s) => s.id === 'smtp_pass')

      expect(setting.value).toEqual('')
    }
  )

  scenario(
    'bulkUpsertSiteSetting encrypts smtp_pass before storing',
    async () => {
      mockCurrentUser({ name: 'Rob', id: 1 })

      await bulkUpsertSiteSetting({
        input: [{ id: 'smtp_pass', value: 'my-secret-password' }],
      })

      const stored = await db.siteSetting.findUnique({
        where: { id: 'smtp_pass' },
      })

      expect(stored.value).not.toEqual('my-secret-password')
      expect(isEncrypted(stored.value)).toBe(true)
      expect(decrypt(stored.value)).toEqual('my-secret-password')
    }
  )

  scenario(
    'bulkUpsertSiteSetting skips smtp_pass when value is blank',
    async () => {
      mockCurrentUser({ name: 'Rob', id: 1 })

      await bulkUpsertSiteSetting({
        input: [{ id: 'smtp_pass', value: 'original-password' }],
      })
      const before = await db.siteSetting.findUnique({
        where: { id: 'smtp_pass' },
      })

      await bulkUpsertSiteSetting({
        input: [{ id: 'smtp_pass', value: '' }],
      })
      const after = await db.siteSetting.findUnique({
        where: { id: 'smtp_pass' },
      })

      expect(after.value).toEqual(before.value)
    }
  )

  scenario(
    'bulkUpsertSiteSetting skips smtp_pass when value is the sentinel',
    async () => {
      mockCurrentUser({ name: 'Rob', id: 1 })

      await bulkUpsertSiteSetting({
        input: [{ id: 'smtp_pass', value: 'original-password' }],
      })
      const before = await db.siteSetting.findUnique({
        where: { id: 'smtp_pass' },
      })

      await bulkUpsertSiteSetting({
        input: [{ id: 'smtp_pass', value: ENCRYPTED_SETTING_SENTINEL }],
      })
      const after = await db.siteSetting.findUnique({
        where: { id: 'smtp_pass' },
      })

      expect(after.value).toEqual(before.value)
    }
  )

  scenario('sendTestEmail calls sendEmail and returns true', async () => {
    const { sendEmail } = require('src/lib/email')

    const result = await sendTestEmail({ to: 'test@example.com' })

    expect(result).toBe(true)
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'test@example.com' })
    )
  })
})
