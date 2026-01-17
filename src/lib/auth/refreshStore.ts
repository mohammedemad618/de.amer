import { prisma } from '@/lib/db/prisma'

/**
 * حفظ Refresh Token في قاعدة البيانات
 * يحذف أي tokens قديمة للمستخدم قبل إضافة الجديدة
 */
export async function storeRefreshToken(userId: string, token: string, expiresAt: number) {
  // حذف جميع الـ tokens القديمة للمستخدم
  await prisma.refreshToken.deleteMany({
    where: {
      userId,
      OR: [
        { expiresAt: { lt: new Date() } }, // منتهية الصلاحية
        { userId } // أو جميع tokens للمستخدم (نحفظ واحد فقط في كل مرة)
      ]
    }
  })

  // إضافة الـ token الجديد
  await prisma.refreshToken.create({
    data: {
      userId,
      token,
      expiresAt: new Date(expiresAt)
    }
  })
}

/**
 * التحقق من صحة Refresh Token من قاعدة البيانات
 */
export async function validateRefreshToken(userId: string, token: string): Promise<boolean> {
  const entry = await prisma.refreshToken.findUnique({
    where: { token },
    select: { userId: true, expiresAt: true }
  })

  if (!entry) {
    return false
  }

  // التحقق من أن الـ token للمستخدم الصحيح
  if (entry.userId !== userId) {
    return false
  }

  // التحقق من انتهاء الصلاحية
  if (entry.expiresAt < new Date()) {
    // حذف الـ token المنتهية
    await prisma.refreshToken.delete({ where: { token } })
    return false
  }

  return true
}

/**
 * حذف Refresh Token من قاعدة البيانات
 */
export async function clearRefreshToken(userId: string) {
  await prisma.refreshToken.deleteMany({
    where: { userId }
  })
}

/**
 * تنظيف جميع الـ tokens المنتهية الصلاحية (يمكن استدعاؤها بشكل دوري)
 */
export async function cleanupExpiredTokens() {
  await prisma.refreshToken.deleteMany({
    where: {
      expiresAt: { lt: new Date() }
    }
  })
}


