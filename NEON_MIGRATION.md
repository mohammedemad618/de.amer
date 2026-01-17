# تحويل قاعدة البيانات إلى Neon (PostgreSQL)

## ✅ التغييرات المكتملة

### 1. package.json
- ✅ إضافة `@netlify/neon`
- ✅ إزالة `@prisma/client` و `prisma` من dependencies (لاحقاً يمكن إزالتهما تماماً)
- ✅ إزالة scripts المتعلقة بـ Prisma

### 2. schema.prisma
- ✅ تحويل من MongoDB إلى PostgreSQL
- ✅ تغيير `provider = "postgresql"`
- ✅ تغيير `url = env("NETLIFY_DATABASE_URL")`
- ✅ تحويل جميع `@db.ObjectId` إلى `uuid()`
- ✅ إزالة `@map("_id")`
- ✅ تحديث جميع `@db.Timestamptz(6)` للتواريخ

### 3. src/lib/db/neon.ts
- ✅ إنشاء Neon SQL client
- ✅ Helper functions: `getFirst`, `getSingle`, `mapRow`

### 4. تحويل الملفات الأساسية
- ✅ `src/lib/db/prisma.ts` → استبدال بـ Neon
- ✅ `src/lib/settings.ts` → تحويل إلى SQL
- ✅ `src/lib/security/rateLimit.ts` → تحويل إلى SQL
- ✅ `src/lib/auth/refreshStore.ts` → تحويل إلى SQL

### 5. تحويل API Routes
- ✅ `src/app/api/auth/login/route.ts`
- ✅ `src/app/api/auth/register/route.ts`
- ✅ `src/app/api/me/route.ts`
- ✅ `src/app/api/courses/route.ts`
- ✅ `src/app/api/courses/[id]/route.ts`
- ✅ `src/app/api/enroll/route.ts`
- ✅ `src/app/api/progress/route.ts`
- ✅ `src/app/api/certificates/[courseId]/route.ts`

### 6. الملفات المتبقية للتحويل
- ⏳ `src/app/api/admin/settings/route.ts`
- ⏳ `src/app/api/admin/settings/[key]/route.ts`
- ⏳ `src/app/api/admin/courses/route.ts`
- ⏳ `src/app/api/admin/courses/[id]/route.ts`
- ⏳ `src/app/api/admin/lessons/route.ts`
- ⏳ `src/app/api/admin/lessons/[id]/route.ts`
- ⏳ Server Components (pages)
- ⏳ Admin pages

## 📋 SQL Migration Script

يجب تنفيذ هذا الـ script في Neon Database:

```sql
-- إنشاء الجداول
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  "passwordHash" VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'USER',
  "createdAt" TIMESTAMPTZ(6) DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  objectives TEXT NOT NULL,
  hours INTEGER NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  level VARCHAR(50) NOT NULL,
  thumbnail VARCHAR(500) NOT NULL,
  "meetingLink" VARCHAR(500),
  "createdAt" TIMESTAMPTZ(6) DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ(6) DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "courseId" UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  "progressPercent" INTEGER NOT NULL,
  "certificateId" VARCHAR(255),
  "certificateUrl" VARCHAR(500),
  "createdAt" TIMESTAMPTZ(6) DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ(6) DEFAULT NOW(),
  UNIQUE ("userId", "courseId")
);

CREATE TABLE IF NOT EXISTS refreshtokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  "expiresAt" TIMESTAMPTZ(6) NOT NULL,
  "createdAt" TIMESTAMPTZ(6) DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ratelimits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip VARCHAR(255) UNIQUE NOT NULL,
  count INTEGER DEFAULT 1,
  "resetAt" TIMESTAMPTZ(6) NOT NULL,
  "createdAt" TIMESTAMPTZ(6) DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ(6) DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "courseId" UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  duration INTEGER,
  "videoUrl" VARCHAR(500),
  resources TEXT,
  "createdAt" TIMESTAMPTZ(6) DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ(6) DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS systemsettings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'string',
  category VARCHAR(100) DEFAULT 'general',
  "updatedAt" TIMESTAMPTZ(6) DEFAULT NOW(),
  "updatedBy" UUID
);

-- إنشاء Indexes
CREATE INDEX IF NOT EXISTS idx_enrollments_userid ON enrollments("userId");
CREATE INDEX IF NOT EXISTS idx_enrollments_courseid ON enrollments("courseId");
CREATE INDEX IF NOT EXISTS idx_refreshtokens_userid ON refreshtokens("userId");
CREATE INDEX IF NOT EXISTS idx_refreshtokens_expiresat ON refreshtokens("expiresAt");
CREATE INDEX IF NOT EXISTS idx_refreshtokens_token ON refreshtokens(token);
CREATE INDEX IF NOT EXISTS idx_ratelimits_resetat ON ratelimits("resetAt");
CREATE INDEX IF NOT EXISTS idx_lessons_courseid ON lessons("courseId");
CREATE INDEX IF NOT EXISTS idx_lessons_courseid_order ON lessons("courseId", "order");
CREATE INDEX IF NOT EXISTS idx_systemsettings_category ON systemsettings(category);
```

## ⚠️ ملاحظات مهمة

1. **Environment Variable**: يجب تغيير `DATABASE_URL` إلى `NETLIFY_DATABASE_URL` في Netlify Environment Variables
2. **Migration**: يجب تنفيذ SQL migration script أعلاه في Neon Database
3. **Server Components**: باقي ملفات Server Components تحتاج للتحويل أيضاً

## 📝 الخطوات التالية

1. تحويل باقي Admin API routes
2. تحويل Server Components (pages)
3. اختبار جميع الوظائف
4. تحديث `.env` محلياً
