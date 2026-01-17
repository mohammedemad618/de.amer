import { sql, getFirst } from '@/lib/db/neon'

/**
 * حفظ Refresh Token في قاعدة البيانات
 * يحذف أي tokens قديمة للمستخدم قبل إضافة الجديدة
 */
export async function storeRefreshToken(userId: string, token: string, expiresAt: number) {
  const now = new Date()
  const expiresAtDate = new Date(expiresAt)

  // حذف جميع الـ tokens القديمة للمستخدم
  await sql`
    DELETE FROM refreshtokens 
    WHERE "userId" = ${userId} 
    AND ("expiresAt" < ${now} OR "userId" = ${userId})
  `

  // إضافة الـ token الجديد
  await sql`
    INSERT INTO refreshtokens (id, "userId", token, "expiresAt", "createdAt")
    VALUES (gen_random_uuid(), ${userId}, ${token}, ${expiresAtDate}, ${now})
  `
}

/**
 * التحقق من صحة Refresh Token من قاعدة البيانات
 */
export async function validateRefreshToken(userId: string, token: string): Promise<boolean> {
  const results = await sql`
    SELECT "userId", "expiresAt" FROM refreshtokens 
    WHERE token = ${token}
    LIMIT 1
  `
  const entry = getFirst(results)

  if (!entry) {
    return false
  }

  // التحقق من أن الـ token للمستخدم الصحيح
  if (entry.userId !== userId) {
    return false
  }

  // التحقق من انتهاء الصلاحية
  if (new Date(entry.expiresAt) < new Date()) {
    // حذف الـ token المنتهية
    await sql`
      DELETE FROM refreshtokens 
      WHERE token = ${token}
    `
    return false
  }

  return true
}

/**
 * حذف Refresh Token من قاعدة البيانات
 */
export async function clearRefreshToken(userId: string) {
  await sql`
    DELETE FROM refreshtokens 
    WHERE "userId" = ${userId}
  `
}

/**
 * تنظيف جميع الـ tokens المنتهية الصلاحية (يمكن استدعاؤها بشكل دوري)
 */
export async function cleanupExpiredTokens() {
  const now = new Date()
  await sql`
    DELETE FROM refreshtokens 
    WHERE "expiresAt" < ${now}
  `
}


