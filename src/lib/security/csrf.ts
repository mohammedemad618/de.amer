import crypto from 'crypto'
import { cookies } from 'next/headers'
import type { NextResponse } from 'next/server'

export const CSRF_COOKIE = 'csrfToken'

export function createCsrfToken() {
  return crypto.randomUUID()
}

export function setCsrfCookie(response: NextResponse, token: string) {
  const isProd = process.env.NODE_ENV === 'production'
  response.cookies.set(CSRF_COOKIE, token, {
    // httpOnly: false ضروري لأن JavaScript يحتاج قراءة الـ token لإرساله في header
    // هذا جزء من Double Submit Cookie pattern - آمن مع sameSite
    httpOnly: false,
    // في التطوير نستخدم 'lax' لتسهيل الاختبار، في الإنتاج نستخدم 'strict'
    sameSite: isProd ? 'strict' : 'lax',
    secure: isProd,
    path: '/',
    maxAge: 60 * 60 * 24 // 24 ساعة
  })
}

export function clearCsrfCookie(response: NextResponse) {
  response.cookies.set(CSRF_COOKIE, '', { path: '/', maxAge: 0 })
}

export async function getCsrfCookie() {
  const cookieStore = await cookies()
  return cookieStore.get(CSRF_COOKIE)?.value
}

export async function verifyCsrf(request: Request) {
  const headerToken = request.headers.get('x-csrf-token')
  const cookieStore = await cookies()
  const cookieToken = cookieStore.get(CSRF_COOKIE)?.value
  
  if (process.env.NODE_ENV === 'development') {
    console.log('[CSRF Debug]', {
      hasHeaderToken: !!headerToken,
      hasCookieToken: !!cookieToken,
      headerToken: headerToken?.substring(0, 8) + '...',
      cookieToken: cookieToken?.substring(0, 8) + '...',
      match: headerToken === cookieToken
    })
  }
  
  if (!headerToken || !cookieToken) {
    return false
  }
  return headerToken === cookieToken
}

/**
 * التحقق من CSRF token مباشرة من token (للاستخدام مع FormData)
 */
export async function verifyCsrfFromToken(token: string | null) {
  if (!token) {
    return false
  }
  
  const cookieStore = await cookies()
  const cookieToken = cookieStore.get(CSRF_COOKIE)?.value
  
  if (process.env.NODE_ENV === 'development') {
    console.log('[CSRF Debug]', {
      hasToken: !!token,
      hasCookieToken: !!cookieToken,
      token: token?.substring(0, 8) + '...',
      cookieToken: cookieToken?.substring(0, 8) + '...',
      match: token === cookieToken
    })
  }
  
  if (!cookieToken) {
    return false
  }
  return token === cookieToken
}


