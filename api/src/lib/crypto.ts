import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from 'crypto'

const ALGORITHM = 'aes-256-gcm'

function getKey(): Buffer {
  const raw = process.env.SETTINGS_ENCRYPTION_KEY
  if (!raw) {
    throw new Error('SETTINGS_ENCRYPTION_KEY environment variable is not set')
  }
  // Accept a 64-char hex key (32 bytes) or derive from a passphrase
  if (/^[0-9a-f]{64}$/i.test(raw)) {
    return Buffer.from(raw, 'hex')
  }
  // Derive a 32-byte key from a passphrase using a fixed salt
  return scryptSync(raw, 'memoryhole-settings', 32)
}

export function encrypt(plaintext: string): string {
  const key = getKey()
  const iv = randomBytes(12) // 96-bit IV recommended for GCM
  const cipher = createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ])
  const authTag = cipher.getAuthTag()
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`
}

export function decrypt(ciphertext: string): string {
  const key = getKey()
  const parts = ciphertext.split(':')
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted value format')
  }
  const [ivHex, authTagHex, encryptedHex] = parts
  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  const encrypted = Buffer.from(encryptedHex, 'hex')
  const decipher = createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)
  return decipher.update(encrypted).toString('utf8') + decipher.final('utf8')
}

export function isEncrypted(value: string): boolean {
  return /^[0-9a-f]+:[0-9a-f]+:[0-9a-f]+$/.test(value)
}
