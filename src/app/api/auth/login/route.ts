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
  email: z.string().email(),
  password: z.string().min(6)
})

export async function POST(request: Request) {
  // #region agent log
  fetch('http://127.0.0.1:7252/ingest/1d56608a-1cd8-45d4-a9f1-37238db6f427',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/auth/login/route.ts:16',message:'POST handler started',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  try {
    const ip = getClientIp(request)
    // في بيئة التطوير، نستخدم حد أعلى لتسهيل الاختبار
    const maxAttempts = process.env.NODE_ENV === 'development' ? 50 : 10
    const windowMs = process.env.NODE_ENV === 'development' ? 5 * 60 * 1000 : 10 * 60 * 1000
    const limit = await rateLimit(ip, maxAttempts, windowMs)

    if (!limit.allowed) {
      // #region agent log
      fetch('http://127.0.0.1:7252/ingest/1d56608a-1cd8-45d4-a9f1-37238db6f427',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/auth/login/route.ts:22',message:'rate limit exceeded',data:{ip},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      return NextResponse.json({ message: 'محاولات كثيرة، حاول لاحقاً.' }, { status: 429 })
    }

    const csrfValid = await verifyCsrf(request)
    // #region agent log
    fetch('http://127.0.0.1:7252/ingest/1d56608a-1cd8-45d4-a9f1-37238db6f427',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/auth/login/route.ts:25',message:'CSRF verification result',data:{csrfValid},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    if (!csrfValid) {
      return NextResponse.json(
        { message: 'رمز الحماية غير صالح. يرجى تحديث الصفحة والمحاولة مرة أخرى.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    // تنظيف البريد الإلكتروني (إزالة المسافات)
    if (body.email) {
      body.email = body.email.trim().toLowerCase()
    }
    const parsed = schema.safeParse(body)
    // #region agent log
    fetch('http://127.0.0.1:7252/ingest/1d56608a-1cd8-45d4-a9f1-37238db6f427',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/auth/login/route.ts:35',message:'body parsed',data:{success:parsed.success,email:parsed.success?parsed.data.email:'invalid'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'بيانات غير صالحة. تأكد من إدخال بريد إلكتروني صالح وكلمة مرور (6 أحرف على الأقل).' },
        { status: 400 }
      )
    }

    // البحث عن المستخدم
    const userResults = await sql`
      SELECT * FROM users 
      WHERE email = ${parsed.data.email}
      LIMIT 1
    `
    const user = getFirst(userResults)
    // #region agent log
    console.log('[DEBUG] User lookup:', { 
      email: parsed.data.email, 
      userFound: !!user, 
      userId: user?.id?.substring(0, 8),
      userRole: user?.role,
      databaseUrl: process.env.DATABASE_URL
    })
    // #endregion
    if (!user) {
      console.log('[DEBUG] User not found for email:', parsed.data.email)
      return NextResponse.json({ message: 'بيانات الدخول غير صحيحة.' }, { status: 401 })
    }

    const validPassword = await bcrypt.compare(parsed.data.password, user.passwordHash)
    // #region agent log
    console.log('[DEBUG] Password check:', { 
      email: parsed.data.email,
      validPassword,
      passwordLength: parsed.data.password.length,
      hashLength: user.passwordHash.length
    })
    // #endregion
    if (!validPassword) {
      console.log('[DEBUG] Invalid password for email:', parsed.data.email)
      return NextResponse.json({ message: 'بيانات الدخول غير صحيحة.' }, { status: 401 })
    }

    const role = (user.role === 'ADMIN' ? 'ADMIN' : 'USER') as 'USER' | 'ADMIN'
    const accessToken = signAccessToken({ sub: user.id, email: user.email, role })
    const refreshToken = signRefreshToken({ sub: user.id, email: user.email, role })
    await storeRefreshToken(user.id, refreshToken, getRefreshExpiryMs())

    const csrfToken = createCsrfToken()
    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email },
      csrfToken
    })
    setAuthCookies(response, accessToken, refreshToken)
    setCsrfCookie(response, csrfToken)
    // #region agent log
    fetch('http://127.0.0.1:7252/ingest/1d56608a-1cd8-45d4-a9f1-37238db6f427',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/auth/login/route.ts:65',message:'login success response',data:{userId:user.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    return response
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7252/ingest/1d56608a-1cd8-45d4-a9f1-37238db6f427',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/auth/login/route.ts:67',message:'login catch error',data:{error:error instanceof Error?error.message:'unknown'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    console.error('خطأ في تسجيل الدخول:', error)
    return NextResponse.json(
      { message: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.' },
      { status: 500 }
    )
  }
}
