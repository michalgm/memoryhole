import { decrypt, encrypt, isEncrypted } from './crypto'

const HEX_KEY = 'a1b2c3d4e5f6a7b8a1b2c3d4e5f6a7b8a1b2c3d4e5f6a7b8a1b2c3d4e5f6a7b8'

describe('crypto', () => {
  beforeEach(() => {
    process.env.SETTINGS_ENCRYPTION_KEY = HEX_KEY
  })

  describe('encrypt / decrypt', () => {
    it('round-trips plaintext', () => {
      const plaintext = 'my-smtp-password-123!'
      expect(decrypt(encrypt(plaintext))).toEqual(plaintext)
    })

    it('produces a different ciphertext each call (random IV)', () => {
      const enc1 = encrypt('same-input')
      const enc2 = encrypt('same-input')
      expect(enc1).not.toEqual(enc2)
    })

    it('does not store the plaintext in the output', () => {
      expect(encrypt('secret')).not.toContain('secret')
    })

    it('throws on ciphertext with wrong number of segments', () => {
      expect(() => decrypt('only:two')).toThrow('Invalid encrypted value format')
      expect(() => decrypt('one')).toThrow('Invalid encrypted value format')
    })

    it('accepts a passphrase key (non-hex) and still round-trips', () => {
      process.env.SETTINGS_ENCRYPTION_KEY = 'a-plain-passphrase-not-64-hex'
      expect(decrypt(encrypt('test-value'))).toEqual('test-value')
    })
  })

  describe('isEncrypted', () => {
    it('returns true for output produced by encrypt', () => {
      expect(isEncrypted(encrypt('test'))).toBe(true)
    })

    it('returns false for plain strings', () => {
      expect(isEncrypted('plain-password')).toBe(false)
    })

    it('returns false for the sentinel value', () => {
      expect(isEncrypted('__REDACTED__')).toBe(false)
    })

    it('returns false for empty string', () => {
      expect(isEncrypted('')).toBe(false)
    })

    it('returns false for only two hex segments', () => {
      expect(isEncrypted('abc123:def456')).toBe(false)
    })
  })
})
