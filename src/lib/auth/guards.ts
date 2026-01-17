import { cookies } from 'next/headers'
import { ACCESS_COOKIE } from './cookies'
import { verifyToken } from './jwt'

export type SessionUser = {
  id: string
  email: string
  role: 'USER' | 'ADMIN'
}

export async function getSessionUser(): Promise<SessionUser | null> {
  // #region agent log
  console.log('[DEBUG] getSessionUser: Starting');
  // #endregion
  const cookieStore = await cookies()
  const token = cookieStore.get(ACCESS_COOKIE)?.value
  // #region agent log
  console.log('[DEBUG] getSessionUser: Cookie check', { hasToken: !!token, tokenPrefix: token?.substring(0, 8) });
  // #endregion
  if (!token) {
    // #region agent log
    console.log('[DEBUG] getSessionUser: No token found');
    // #endregion
    return null
  }
  try {
    const payload = verifyToken(token)
    // #region agent log
    console.log('[DEBUG] getSessionUser: Token verified', { type: payload.type, userId: payload.sub?.substring(0, 8) });
    // #endregion
    if (payload.type !== 'access') {
      // #region agent log
      console.log('[DEBUG] getSessionUser: Token type is not access', { type: payload.type });
      // #endregion
      return null
    }
    // #region agent log
    console.log('[DEBUG] getSessionUser: Returning session user', { id: payload.sub?.substring(0, 8), email: payload.email });
    // #endregion
    return { id: payload.sub, email: payload.email, role: payload.role }
  } catch (error) {
    // #region agent log
    console.log('[DEBUG] getSessionUser: Token verification failed', { error: error instanceof Error ? error.message : 'unknown' });
    // #endregion
    return null
  }
}

/**
 * التحقق من أن المستخدم الحالي مسؤول (ADMIN)
 * @returns SessionUser إذا كان مسؤولاً، null إذا لم يكن
 */
export async function requireAdmin(): Promise<SessionUser> {
  const session = await getSessionUser()
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required')
  }
  return session
}


