import { createHmac } from 'crypto'

const AUTH_SECRET = process.env.AUTH_SECRET || 'dev-secret-change-me'

export interface AuthPayload {
  sub: number
  email: string
  role: string
}

export function signToken(payload: AuthPayload) {
  const base = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = createHmac('sha256', AUTH_SECRET).update(base).digest('base64url')
  return `${base}.${sig}`
}

export function verifyToken(token?: string): AuthPayload | null {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [base, sig] = parts
  const expected = createHmac('sha256', AUTH_SECRET).update(base).digest('base64url')
  if (expected !== sig) return null
  try {
    const payload = JSON.parse(Buffer.from(base, 'base64url').toString())
    if (!payload?.sub || !payload?.email) return null
    return payload as AuthPayload
  } catch {
    return null
  }
}