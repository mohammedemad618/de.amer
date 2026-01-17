import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyCsrf, clearCsrfCookie } from '@/lib/security/csrf'
import { clearAuthCookies, REFRESH_COOKIE } from '@/lib/auth/cookies'
import { verifyToken } from '@/lib/auth/jwt'
import { clearRefreshToken } from '@/lib/auth/refreshStore'

export async function POST(request: Request) {
  if (!(await verifyCsrf(request))) {
    return NextResponse.json({ message: 'رمز الحماية غير صالح.' }, { status: 403 })
  }

  const cookieStore = await cookies()
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value
  if (refreshToken) {
    try {
      const payload = verifyToken(refreshToken)
      await clearRefreshToken(payload.sub)
    } catch {
      // في حالة الخطأ، نحاول حذف جميع الـ tokens (fallback)
      // لكن clearRefreshToken يتوقع userId، لذا سنتخطى هذا
    }
  }

  const response = NextResponse.json({ ok: true })
  clearAuthCookies(response)
  clearCsrfCookie(response)
  return response
}
