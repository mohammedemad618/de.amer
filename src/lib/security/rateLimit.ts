import { prisma } from '@/lib/db/prisma'

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
  const now = Date.now()
  const resetAt = new Date(now + windowMs)

  // تنظيف الـ entries المنتهية
  await prisma.rateLimit.deleteMany({
    where: {
      resetAt: { lt: new Date(now) }
    }
  })

  // البحث عن entry موجودة
  const existing = await prisma.rateLimit.findUnique({
    where: { ip }
  })

  if (!existing) {
    // إنشاء entry جديدة
    await prisma.rateLimit.create({
      data: {
        ip,
        count: 1,
        resetAt
      }
    })
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs }
  }

  // التحقق من انتهاء النافذة الزمنية
  if (existing.resetAt < new Date(now)) {
    // إعادة تعيين العد
    await prisma.rateLimit.update({
      where: { ip },
      data: {
        count: 1,
        resetAt
      }
    })
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs }
  }

  // التحقق من تجاوز الحد
  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt.getTime() }
  }

  // زيادة العد
  const updated = await prisma.rateLimit.update({
    where: { ip },
    data: {
      count: { increment: 1 }
    }
  })

  return {
    allowed: true,
    remaining: limit - updated.count,
    resetAt: updated.resetAt.getTime()
  }
}


