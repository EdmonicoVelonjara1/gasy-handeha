import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

// Default local account requested for the initial authentication flow.
export const DEFAULT_CREDENTIALS = {
  email: 'admin@gasy-handeha.mg',
  password: 'GasyHandeha2026!',
} as const

export const SESSION_COOKIE_NAME = 'gasy_session'
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8

// This fallback keeps the default account usable locally. Set AUTH_SECRET in
// production so sessions are signed with a private deployment secret.
const FALLBACK_SESSION_SECRET =
  '1b081cd9c48cf797aeb62fdf25ee25c2b077d8d0a5dcb336bc3680ea706cb2e6'

function constantTimeEqual(value: string, expected: string) {
  const valueHash = createHash('sha256').update(value).digest()
  const expectedHash = createHash('sha256').update(expected).digest()

  return timingSafeEqual(valueHash, expectedHash)
}

function signSessionPayload(payload: string) {
  const secret =
    process.env.AUTH_SECRET?.trim() || FALLBACK_SESSION_SECRET

  return createHmac('sha256', secret).update(payload).digest('base64url')
}

export function areDefaultCredentialsValid(email: string, password: string) {
  const emailMatches = constantTimeEqual(
    email.trim().toLowerCase(),
    DEFAULT_CREDENTIALS.email,
  )
  const passwordMatches = constantTimeEqual(
    password,
    DEFAULT_CREDENTIALS.password,
  )

  return emailMatches && passwordMatches
}

export function createSessionToken(now = Date.now()) {
  const payload = Buffer.from(
    JSON.stringify({
      email: DEFAULT_CREDENTIALS.email,
      expiresAt: now + SESSION_MAX_AGE_SECONDS * 1000,
      version: 1,
    }),
  ).toString('base64url')
  const signature = signSessionPayload(payload)

  return `${payload}.${signature}`
}

export function isValidSessionToken(token: string | undefined, now = Date.now()) {
  if (!token) return false

  const [payload, signature, extra] = token.split('.')
  if (!payload || !signature || extra) return false

  const expectedSignature = signSessionPayload(payload)
  if (!constantTimeEqual(signature, expectedSignature)) return false

  try {
    const session = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8'),
    ) as {
      email?: unknown
      expiresAt?: unknown
      version?: unknown
    }

    return (
      session.version === 1 &&
      session.email === DEFAULT_CREDENTIALS.email &&
      typeof session.expiresAt === 'number' &&
      Number.isSafeInteger(session.expiresAt) &&
      session.expiresAt > now
    )
  } catch {
    return false
  }
}

export function getSafeRedirectPath(
  value: FormDataEntryValue | string | null | undefined,
  fallback = '/dashboard',
) {
  if (
    typeof value !== 'string' ||
    !value.startsWith('/') ||
    value.startsWith('//')
  ) {
    return fallback
  }

  return value
}
