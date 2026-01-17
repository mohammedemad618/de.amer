import { neon } from '@neondatabase/serverless'

// Neon SQL client - يستخدم DATABASE_URL أو NETLIFY_DATABASE_URL
// في development أو build phase، إذا كان connection string مفقوداً، نستخدم placeholder صحيح
function getConnectionString(): string {
  const connectionString = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL
  
  if (!connectionString) {
    // في development أو build phase، نستخدم placeholder صحيح للتنسيق (لن يعمل لكن لن يكسر التطبيق)
    const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'
    if (process.env.NODE_ENV === 'development' || isBuildPhase) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠ DATABASE_URL missing in development. Using placeholder. Please add your Neon PostgreSQL connection string to .env')
      }
      return 'postgresql://placeholder:placeholder@placeholder:5432/placeholder?sslmode=require'
    }
    // في production runtime (بعد البناء)، نرمي خطأ
    throw new Error('DATABASE_URL or NETLIFY_DATABASE_URL is required. Please add it to your environment variables.')
  }
  
  return connectionString
}

export const sql = neon(getConnectionString())

// Helper functions للتعامل مع النتائج
export type QueryResult<T = any> = T[]

/**
 * Helper لتحويل نتائج SQL إلى Objects
 */
export function mapRow<T>(row: any): T {
  return row as T
}

/**
 * Helper للحصول على أول نتيجة
 */
export function getFirst<T>(results: T[]): T | null {
  return results.length > 0 ? results[0] : null
}

/**
 * Helper للحصول على نتيجة واحدة فقط (يجب أن تكون واحدة)
 */
export function getSingle<T>(results: T[]): T {
  if (results.length !== 1) {
    throw new Error(`Expected exactly 1 result, got ${results.length}`)
  }
  return results[0]
}
