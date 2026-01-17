import jwt from 'jsonwebtoken'
import { env } from '@/lib/config/env'

// JWT_SECRET يتم التحقق منه في env.ts
const JWT_SECRET = env.JWT_SECRET

const ACCESS_EXPIRES_IN = '15m'
const REFRESH_EXPIRES_IN = '7d'

export type AuthTokenPayload = {
  sub: string
  email: string
  role: 'USER' | 'ADMIN'
  type: 'access' | 'refresh'
}

export function signAccessToken(payload: Omit<AuthTokenPayload, 'type'>) {
  // #region agent log
  console.log('[DEBUG] signAccessToken: Using JWT_SECRET', { 
    secretLength: JWT_SECRET?.length,
    secretPrefix: JWT_SECRET?.substring(0, 8)
  })
  // #endregion
  return jwt.sign({ ...payload, type: 'access' }, JWT_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN
  })
}

export function signRefreshToken(payload: Omit<AuthTokenPayload, 'type'>) {
  return jwt.sign({ ...payload, type: 'refresh' }, JWT_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN
  })
}

export function verifyToken(token: string) {
  // #region agent log
  console.log('[DEBUG] verifyToken: Using JWT_SECRET', { 
    secretLength: JWT_SECRET?.length,
    secretPrefix: JWT_SECRET?.substring(0, 8),
    tokenPrefix: token?.substring(0, 20)
  })
  // #endregion
  return jwt.verify(token, JWT_SECRET) as AuthTokenPayload
}

export function getRefreshExpiryMs() {
  const sevenDays = 7 * 24 * 60 * 60 * 1000
  return Date.now() + sevenDays
}


