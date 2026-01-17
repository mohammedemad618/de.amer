import { NextResponse } from 'next/server'
import { createCsrfToken, setCsrfCookie } from '@/lib/security/csrf'

export async function GET() {
  const token = createCsrfToken()
  const response = NextResponse.json({ csrfToken: token })
  setCsrfCookie(response, token)
  return response
}


