import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { REFRESH_COOKIE } from '@/lib/auth/cookies'
import { signAccessToken, signRefreshToken, verifyToken, getRefreshExpiryMs } from '@/lib/auth/jwt'
import { setAuthCookies } from '@/lib/auth/cookies'
import { validateRefreshToken, storeRefreshToken } from '@/lib/auth/refreshStore'
import { createCsrfToken, setCsrfCookie, verifyCsrf } from '@/lib/security/csrf'

export async function POST(request: Request) {
  if (!(await verifyCsrf(request))) {
    return NextResponse.json({ message: 'رمز الحماية غير صالح.' }, { status: 403 })
  }

  const cookieStore = await cookies()
  const token = cookieStore.get(REFRESH_COOKIE)?.value
  if (!token) {
    return NextResponse.json({ message: 'غير مصرح.' }, { status: 401 })
  }

  try {
    const payload = verifyToken(token)
    if (payload.type !== 'refresh') {
      return NextResponse.json({ message: 'رمز غير صالح.' }, { status: 401 })
    }

    if (!(await validateRefreshToken(payload.sub, token))) {
      return NextResponse.json({ message: 'رمز غير صالح.' }, { status: 401 })
    }

    const accessToken = signAccessToken({ sub: payload.sub, email: payload.email, role: payload.role })
    const refreshToken = signRefreshToken({ sub: payload.sub, email: payload.email, role: payload.role })
    await storeRefreshToken(payload.sub, refreshToken, getRefreshExpiryMs())

    const csrfToken = createCsrfToken()
    const response = NextResponse.json({ ok: true, csrfToken })
    setAuthCookies(response, accessToken, refreshToken)
    setCsrfCookie(response, csrfToken)
    return response
  } catch {
    return NextResponse.json({ message: 'رمز غير صالح.' }, { status: 401 })
  }
}
