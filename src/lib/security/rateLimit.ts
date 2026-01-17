import { sql, getFirst } from '@/lib/db/neon'

export function getClientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() ?? 'unknown'
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }
  
  // في بيئة التطوير، نستخدم User-Agent كمعرف فريد لتجنب Rate Limiting المشترك
  if (process.env.NODE_ENV === 'development') {
    const userAgent = request.headers.get('user-agent') || 'unknown'
    // استخدام hash بسيط من User-Agent لتجنب تخزين بيانات كبيرة
    return `dev-${userAgent.substring(0, 20).replace(/\s/g, '-')}`
  }
  
  return 'unknown'
}

/**
 * Rate Limiting باستخدام قاعدة البيانات
 * يدعم multi-server environments
 */
export async function rateLimit(ip: string, limit: number, windowMs: number) {
  const now = new Date()
  const resetAt = new Date(Date.now() + windowMs)

  // تنظيف الـ entries المنتهية
  await sql`
    DELETE FROM ratelimits 
    WHERE "resetAt" < ${now}
  `

  // البحث عن entry موجودة
  const existingResults = await sql`
    SELECT * FROM ratelimits 
    WHERE ip = ${ip}
    LIMIT 1
  `
  const existing = getFirst(existingResults)

  if (!existing) {
    // إنشاء entry جديدة
    await sql`
      INSERT INTO ratelimits (ip, count, "resetAt", "createdAt", "updatedAt")
      VALUES (${ip}, 1, ${resetAt}, ${now}, ${now})
    `
    return { allowed: true, remaining: limit - 1, resetAt: Date.now() + windowMs }
  }

  // التحقق من انتهاء النافذة الزمنية
  if (new Date(existing.resetAt) < now) {
    // إعادة تعيين العد
    await sql`
      UPDATE ratelimits 
      SET count = 1, "resetAt" = ${resetAt}, "updatedAt" = ${now}
      WHERE ip = ${ip}
    `
    return { allowed: true, remaining: limit - 1, resetAt: Date.now() + windowMs }
  }

  // التحقق من تجاوز الحد
  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: new Date(existing.resetAt).getTime() }
  }

  // زيادة العد
  const updatedResults = await sql`
    UPDATE ratelimits 
    SET count = count + 1, "updatedAt" = ${now}
    WHERE ip = ${ip}
    RETURNING *
  `
  const updated = getFirst(updatedResults)

  return {
    allowed: true,
    remaining: limit - updated.count,
    resetAt: new Date(updated.resetAt).getTime()
  }
}


