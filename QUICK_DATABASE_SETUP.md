# ⚡ إعداد قاعدة البيانات بسرعة

## ✅ الخطوة 1: Environment Variables (مكتمل)
تم إعداد `NETLIFY_DATABASE_URL` في Netlify بنجاح ✓

## 📋 الخطوة 2: تنفيذ SQL Migrations

### 1. افتح Neon SQL Editor

1. اذهب إلى [Neon Console](https://console.neon.tech/)
2. اختر مشروعك (project)
3. انقر على **SQL Editor** من القائمة الجانبية

### 2. تنفيذ Schema Migration

انسخ **كل محتوى** ملف `prisma/migrations/neon_init.sql`:

```
-- Neon PostgreSQL Migration Script
-- يجب تنفيذ هذا الـ script في Neon Database

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

الصقه في SQL Editor واضغط **Run** أو **Execute**

### 3. تنفيذ Default Settings Seed

بعد نجاح الخطوة 2، انسخ **كل محتوى** ملف `prisma/migrations/neon_seed_defaults.sql`:

```
-- Neon PostgreSQL Default Settings Seed Script
-- يجب تنفيذ هذا الـ script بعد neon_init.sql لإدراج الإعدادات الافتراضية

-- إدراج الإعدادات الافتراضية (General Settings)
INSERT INTO systemsettings (key, value, type, category, "updatedAt")
VALUES 
  ('site_name', 'أمار للتعليم الطبي', 'string', 'general', NOW()),
  ('site_description', 'منصة عربية لتطوير المهارات المهنية في التغذية العلاجية والعلاج الوظيفي', 'string', 'general', NOW()),
  ('site_url', 'https://amar-medical.com', 'string', 'general', NOW()),
  ('enable_registrations', 'true', 'boolean', 'general', NOW())
ON CONFLICT (key) DO NOTHING;

-- إدراج إعدادات التواصل (Contact Settings)
INSERT INTO systemsettings (key, value, type, category, "updatedAt")
VALUES 
  ('contact_email', 'info@amar-medical.com', 'string', 'contact', NOW()),
  ('contact_phone', '+966500000000', 'string', 'contact', NOW()),
  ('contact_address', 'دمشق - سوريا', 'string', 'contact', NOW())
ON CONFLICT (key) DO NOTHING;

-- إدراج إعدادات SEO (SEO Settings)
INSERT INTO systemsettings (key, value, type, category, "updatedAt")
VALUES 
  ('meta_keywords', 'التغذية العلاجية, العلاج الوظيفي, التعليم الطبي, الدورات الطبية', 'string', 'seo', NOW()),
  ('og_image', '/og-image.jpg', 'string', 'seo', NOW()),
  ('og_title', 'أمار للتعليم الطبي', 'string', 'seo', NOW()),
  ('og_description', 'منصة عربية لتطوير المهارات المهنية في التغذية العلاجية والعلاج الوظيفي', 'string', 'seo', NOW())
ON CONFLICT (key) DO NOTHING;

-- إدراج إعدادات الدورات (Courses Settings)
INSERT INTO systemsettings (key, value, type, category, "updatedAt")
VALUES 
  ('default_currency', 'USD', 'string', 'courses', NOW()),
  ('courses_per_page', '12', 'number', 'courses', NOW()),
  ('enable_enrollments', 'true', 'boolean', 'courses', NOW())
ON CONFLICT (key) DO NOTHING;

-- إدراج إعدادات البريد الإلكتروني (Email Settings)
INSERT INTO systemsettings (key, value, type, category, "updatedAt")
VALUES 
  ('email_from_name', 'أمار للتعليم الطبي', 'string', 'email', NOW()),
  ('email_from_address', 'noreply@amar-medical.com', 'string', 'email', NOW()),
  ('email_smtp_host', 'smtp.example.com', 'string', 'email', NOW()),
  ('email_smtp_port', '587', 'number', 'email', NOW()),
  ('email_smtp_user', '', 'string', 'email', NOW()),
  ('email_smtp_password', '', 'string', 'email', NOW()),
  ('email_enabled', 'false', 'boolean', 'email', NOW())
ON CONFLICT (key) DO NOTHING;

-- إدراج إعدادات الأمان (Security Settings)
INSERT INTO systemsettings (key, value, type, category, "updatedAt")
VALUES 
  ('max_login_attempts', '5', 'number', 'security', NOW()),
  ('lockout_duration', '15', 'number', 'security', NOW()),
  ('session_timeout', '60', 'number', 'security', NOW()),
  ('require_email_verification', 'false', 'boolean', 'security', NOW()),
  ('password_min_length', '8', 'number', 'security', NOW())
ON CONFLICT (key) DO NOTHING;

-- إدراج إعدادات الدفع (Payment Settings)
INSERT INTO systemsettings (key, value, type, category, "updatedAt")
VALUES 
  ('payment_gateway', 'stripe', 'string', 'payment', NOW()),
  ('payment_enabled', 'false', 'boolean', 'payment', NOW()),
  ('stripe_publishable_key', '', 'string', 'payment', NOW()),
  ('stripe_secret_key', '', 'string', 'payment', NOW()),
  ('stripe_webhook_secret', '', 'string', 'payment', NOW())
ON CONFLICT (key) DO NOTHING;

-- التحقق من الإدراج
SELECT category, COUNT(*) as count 
FROM systemsettings 
GROUP BY category 
ORDER BY category;
```

الصقه في SQL Editor واضغط **Run** أو **Execute**

### 4. التحقق من النجاح

في SQL Editor، نفّذ:

```sql
-- التحقق من الجداول
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;

-- يجب أن ترى:
-- courses, enrollments, lessons, ratelimits, refreshtokens, systemsettings, users

-- التحقق من الإعدادات
SELECT category, COUNT(*) as count 
FROM systemsettings GROUP BY category ORDER BY category;

-- يجب أن ترى:
-- contact: 3, courses: 3, email: 7, general: 4, payment: 5, security: 5, seo: 4
```

## 🔄 الخطوة 3: إعادة Deploy على Netlify

بعد تنفيذ SQL migrations بنجاح:

1. اذهب إلى [Netlify Dashboard](https://app.netlify.com/)
2. اختر موقعك
3. اذهب إلى **Deploys**
4. انقر على **Trigger deploy** → **Clear cache and deploy site**

**أو** ادفع commit جديد إلى GitHub (سيبدأ deploy تلقائياً).

## ✅ التحقق النهائي

بعد الـ deploy:

1. افتح موقعك على Netlify
2. يجب أن تظهر الصفحة الرئيسية بدون أخطاء
3. تحقق من أن الإعدادات تعمل:
   - افتح `/admin/settings` (بعد تسجيل الدخول كـ admin)
   - يجب أن ترى جميع الإعدادات الافتراضية

## 🆘 إذا استمرت المشكلة

تحقق من:
1. **Netlify Function Logs**: Site settings → Functions → View logs
2. **صحة SQL**: تأكد من تنفيذ SQL migrations بنجاح
3. **Connection String**: تأكد من أن `NETLIFY_DATABASE_URL` صحيح

---

**بعد إكمال جميع الخطوات، الموقع يجب أن يعمل بشكل كامل! 🎉**
