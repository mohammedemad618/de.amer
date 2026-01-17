import { cookies } from 'next/headers'
import { ACCESS_COOKIE } from './cookies'
import { verifyToken } from './jwt'

export type SessionUser = {
  id: string
  email: string
  role: 'USER' | 'ADMIN'
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ACCESS_COOKIE)?.value
  if (!token) {
    return null
  }
  try {
    const payload = verifyToken(token)
    if (payload.type !== 'access') {
      return null
    }
    return { id: payload.sub, email: payload.email, role: payload.role }
  } catch (error) {
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


