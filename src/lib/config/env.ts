import { z } from 'zod'
import crypto from 'crypto'

// Schema للتحقق من متغيرات البيئة المطلوبة (server-side only)
const serverEnvSchema = z.object({
  // Database - يدعم DATABASE_URL أو NETLIFY_DATABASE_URL
  DATABASE_URL: z.string().min(1, 'DATABASE_URL or NETLIFY_DATABASE_URL is required').optional(),
  NETLIFY_DATABASE_URL: z.string().min(1, 'DATABASE_URL or NETLIFY_DATABASE_URL is required').optional(),
  
  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  
  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development')
})

// Schema للتطوير: يسمح بإكمال JWT_SECRET تلقائياً لتسهيل التشغيل محلياً
const serverEnvSchemaDev = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL or NETLIFY_DATABASE_URL is required').optional(),
  NETLIFY_DATABASE_URL: z.string().min(1, 'DATABASE_URL or NETLIFY_DATABASE_URL is required').optional(),
  JWT_SECRET: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development')
})

// Cache لـ JWT_SECRET لضمان أنه ثابت بين جميع الطلبات
// استخدام globalThis لضمان أن القيمة ثابتة حتى بعد إعادة تحميل الوحدات
declare global {
  // eslint-disable-next-line no-var
  var __JWT_SECRET_CACHE__: string | undefined
}

const getCachedJwtSecret = (): string | null => {
  if (typeof globalThis !== 'undefined') {
    return globalThis.__JWT_SECRET_CACHE__ || null
  }
  return null
}

const setCachedJwtSecret = (secret: string): void => {
  if (typeof globalThis !== 'undefined') {
    globalThis.__JWT_SECRET_CACHE__ = secret
  }
}

// التحقق من المتغيرات Server-side فقط
function validateServerEnv() {
  // التحقق فقط في server-side
  if (typeof window !== 'undefined') {
    return {} as z.infer<typeof serverEnvSchema>
  }
  
  try {
    // قراءة DATABASE_URL أو NETLIFY_DATABASE_URL من process.env
    let databaseUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL
    
    // أثناء البناء (NEXT_PHASE === 'phase-production-build')، قد لا يكون DATABASE_URL متاحاً
    // لكن في runtime (production بعد البناء)، DATABASE_URL مطلوب
    const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'
    
    if (!databaseUrl && !isBuildPhase) {
      // في runtime (وليس أثناء البناء)، DATABASE_URL مطلوب
      if (process.env.NODE_ENV === 'production') {
        const errorMsg = 'DATABASE_URL or NETLIFY_DATABASE_URL is required. Please add it to your environment variables in Netlify.'
        console.error(`❌ ${errorMsg}`)
        throw new Error(errorMsg)
      } else {
        // في development، نستخدم قيمة placeholder (لن تعمل لكن لن تكسر التطبيق)
        console.warn('⚠ DATABASE_URL or NETLIFY_DATABASE_URL is missing in development. Using placeholder. Please add your Neon PostgreSQL connection string to your .env file.')
        databaseUrl = 'postgresql://placeholder:placeholder@placeholder:5432/placeholder?sslmode=require'
        process.env.DATABASE_URL = databaseUrl
      }
    }
    
    if (!databaseUrl && isBuildPhase) {
      // أثناء البناء، نستخدم قيمة افتراضية (لن تعمل لكن لن تكسر البناء)
      // المستخدم يجب أن يضيف DATABASE_URL أو NETLIFY_DATABASE_URL في Netlify Environment Variables
      console.warn('⚠ DATABASE_URL or NETLIFY_DATABASE_URL is missing during build. Please add it to Netlify Environment Variables.')
      // نستخدم قيمة placeholder (لن تعمل لكن لن تكسر البناء)
      databaseUrl = 'postgresql://placeholder:placeholder@placeholder:5432/placeholder?sslmode=require'
      process.env.DATABASE_URL = databaseUrl
    }
    
    // في production runtime (ما عدا مرحلة build)، نطبق التحقق الصارم
    if (process.env.NODE_ENV === 'production' && !isBuildPhase) {
      return serverEnvSchema.parse(process.env)
    }
    
    const parsed = serverEnvSchemaDev.parse(process.env)
    
    // استخدام cache لضمان أن JWT_SECRET ثابت بين جميع الطلبات
    let jwtSecret: string
    if (parsed.JWT_SECRET && parsed.JWT_SECRET.length >= 32) {
      jwtSecret = parsed.JWT_SECRET
      setCachedJwtSecret(jwtSecret)
    } else {
      // إذا كان هناك cache، استخدمه. وإلا، أنشئ واحداً جديداً
      const cached = getCachedJwtSecret()
      if (cached) {
        jwtSecret = cached
      } else {
        jwtSecret = crypto.randomBytes(32).toString('hex')
        setCachedJwtSecret(jwtSecret)
        // تحذير فقط (بدون كسر build/dev)
        console.warn('⚠ JWT_SECRET is missing/too short. Generated a temporary secret for local use.')
      }
    }

    return {
      DATABASE_URL: databaseUrl || 'postgresql://placeholder:placeholder@placeholder:5432/placeholder?sslmode=require',
      NETLIFY_DATABASE_URL: databaseUrl || 'postgresql://placeholder:placeholder@placeholder:5432/placeholder?sslmode=require',
      JWT_SECRET: jwtSecret,
      NODE_ENV: parsed.NODE_ENV || 'development'
    } as z.infer<typeof serverEnvSchema>
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n')
      throw new Error(
        `❌ Environment variables validation failed:\n${missingVars}\n\n` +
        'Please check your .env file and ensure all required variables are set.'
      )
    }
    throw error
  }
}

// Export validated environment variables (server-side only)
export const env = validateServerEnv()

// Debug log only in development
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('[DEBUG] env.JWT_SECRET initialized', { 
    hasSecret: !!env.JWT_SECRET, 
    secretLength: env.JWT_SECRET?.length,
    secretPrefix: env.JWT_SECRET?.substring(0, 8)
  })
}

// Helper functions
export function getBaseUrl(): string {
  // استخدام NEXT_PUBLIC_ للوصول في client-side
  if (typeof window !== 'undefined') {
    // Client-side
    return process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
  }
  
  // Server-side
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'http://localhost:3000'
}
