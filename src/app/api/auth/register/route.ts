import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { sql, getFirst } from '@/lib/db/neon'
import { rateLimit, getClientIp } from '@/lib/security/rateLimit'
import { verifyCsrf, createCsrfToken, setCsrfCookie } from '@/lib/security/csrf'
import { signAccessToken, signRefreshToken, getRefreshExpiryMs } from '@/lib/auth/jwt'
import { setAuthCookies } from '@/lib/auth/cookies'
import { storeRefreshToken } from '@/lib/auth/refreshStore'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
})

export async function POST(request: Request) {
  const ip = getClientIp(request)
  const limit = await rateLimit(ip, 10, 10 * 60 * 1000)

  if (!limit.allowed) {
    return NextResponse.json({ message: 'محاولات كثيرة، حاول لاحقاً.' }, { status: 429 })
  }

  if (!(await verifyCsrf(request))) {
    return NextResponse.json({ message: 'رمز الحماية غير صالح.' }, { status: 403 })
  }

  const body = await request.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ message: 'بيانات غير صالحة.' }, { status: 400 })
  }

  const existingResults = await sql`
    SELECT * FROM users 
    WHERE email = ${parsed.data.email}
    LIMIT 1
  `
  const existing = getFirst(existingResults)
  if (existing) {
    return NextResponse.json({ message: 'البريد الإلكتروني مستخدم بالفعل.' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10)
  const now = new Date()
  const userResults = await sql`
    INSERT INTO users (id, name, email, "passwordHash", role, "createdAt")
    VALUES (gen_random_uuid(), ${parsed.data.name}, ${parsed.data.email}, ${passwordHash}, 'USER', ${now})
    RETURNING *
  `
  const user = getFirst(userResults)

  const role = user.role === 'ADMIN' ? 'ADMIN' : 'USER'
  const accessToken = signAccessToken({ sub: user.id, email: user.email, role })
  const refreshToken = signRefreshToken({ sub: user.id, email: user.email, role })
  await storeRefreshToken(user.id, refreshToken, getRefreshExpiryMs())

  const csrfToken = createCsrfToken()
  const response = NextResponse.json(
    { user: { id: user.id, name: user.name, email: user.email }, csrfToken },
    { status: 201 }
  )
  setAuthCookies(response, accessToken, refreshToken)
  setCsrfCookie(response, csrfToken)
  return response
}
