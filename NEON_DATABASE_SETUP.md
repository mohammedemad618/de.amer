# 🗄️ إعداد قاعدة البيانات Neon على Netlify

## ✅ الخطوة 1: إضافة Environment Variables (مكتمل)

تم إضافة `NETLIFY_DATABASE_URL` في Netlify Environment Variables بنجاح.

## 📋 الخطوة 2: تنفيذ SQL Migration

### 1. افتح Neon Console

1. اذهب إلى [Neon Console](https://console.neon.tech/)
2. اختر مشروعك (project)
3. اذهب إلى **SQL Editor**

### 2. تنفيذ Schema Migration

انسخ محتوى ملف `prisma/migrations/neon_init.sql` والصقه في SQL Editor، ثم نفّذه.

هذا سيُنشئ جميع الجداول المطلوبة:
- `users` - المستخدمين
- `courses` - الدورات
- `enrollments` - التسجيلات
- `refreshtokens` - Refresh Tokens
- `ratelimits` - Rate Limiting
- `lessons` - الدروس
- `systemsettings` - إعدادات النظام

### 3. تنفيذ Default Settings Seed

انسخ محتوى ملف `prisma/migrations/neon_seed_defaults.sql` والصقه في SQL Editor، ثم نفّذه.

هذا سيُدرج الإعدادات الافتراضية المطلوبة:
- إعدادات عامة (site_name, site_description, etc.)
- إعدادات التواصل (contact_email, contact_phone, etc.)
- إعدادات SEO (meta_keywords, og_image, etc.)
- إعدادات الدورات (default_currency, courses_per_page, etc.)
- إعدادات البريد الإلكتروني
- إعدادات الأمان
- إعدادات الدفع

## 🔄 الخطوة 3: إعادة Deploy على Netlify

بعد تنفيذ SQL migrations:

1. اذهب إلى [Netlify Dashboard](https://app.netlify.com/)
2. اختر موقعك
3. اذهب إلى **Deploys**
4. انقر على **Trigger deploy** → **Clear cache and deploy site**

أو ادفع commit جديد إلى GitHub (سيبدأ deploy تلقائياً).

## ✅ التحقق من النجاح

### 1. تحقق من الجداول

في Neon SQL Editor، نفّذ:

```sql
-- التحقق من الجداول
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- يجب أن ترى:
-- courses
-- enrollments
-- lessons
-- ratelimits
-- refreshtokens
-- systemsettings
-- users
```

### 2. تحقق من الإعدادات

```sql
-- التحقق من الإعدادات الافتراضية
SELECT category, COUNT(*) as count 
FROM systemsettings 
GROUP BY category 
ORDER BY category;

-- يجب أن ترى:
-- contact: 3
-- courses: 3
-- email: 7
-- general: 4
-- payment: 5
-- security: 5
-- seo: 4
```

### 3. تحقق من الموقع

1. افتح موقعك على Netlify
2. يجب أن تظهر الصفحة الرئيسية بدون أخطاء
3. اذهب إلى `/admin/settings` (بعد تسجيل الدخول كـ admin)
4. يجب أن ترى جميع الإعدادات الافتراضية

## 🔧 إنشاء مستخدم Admin

لإنشاء مستخدم admin يدوياً:

```sql
-- إدراج مستخدم admin (استبدل القيم بالبيانات الخاصة بك)
INSERT INTO users (id, name, email, "passwordHash", role, "createdAt")
VALUES (
  gen_random_uuid(),
  'Admin User',
  'admin@example.com',
  '$2b$10$YourHashedPasswordHere', -- استخدم bcrypt hash للكلمة السرية
  'ADMIN',
  NOW()
);
```

**ملاحظة مهمة**: يجب hash كلمة السر باستخدام bcrypt قبل الإدراج. يمكنك استخدام:

```javascript
// في Node.js
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash('your-password', 10);
console.log(hash);
```

أو استخدام [Bcrypt Generator Online](https://bcrypt-generator.com/) (لا تستخدم في production!)

## 📝 ملاحظات مهمة

- ⚠️ **لا تشارك `NETLIFY_DATABASE_URL`** - هذه معلومات حساسة
- 🔒 تأكد من أن كلمة سر قاعدة البيانات قوية
- 📝 بعد تنفيذ migrations، تحقق من صحة البيانات
- 🔄 بعد أي تغيير في قاعدة البيانات، تأكد من إعادة deploy

## 🆘 استكشاف الأخطاء

### خطأ: "relation does not exist"

**السبب**: لم يتم تنفيذ `neon_init.sql`

**الحل**: 
1. افتح Neon SQL Editor
2. نفّذ `neon_init.sql` أولاً
3. ثم نفّذ `neon_seed_defaults.sql`

### خطأ: "duplicate key value violates unique constraint"

**السبب**: تم تنفيذ SQL migration مسبقاً

**الحل**: 
- استخدم `ON CONFLICT DO NOTHING` في INSERT statements (موجود بالفعل في `neon_seed_defaults.sql`)
- أو احذف البيانات الموجودة قبل الإدراج

### الموقع يعرض "Internal Server Error"

**التحقق من**:
1. Netlify Function logs → ابحث عن أخطاء Database connection
2. تأكد من أن `NETLIFY_DATABASE_URL` موجود في Environment Variables
3. تأكد من تنفيذ SQL migrations

## 📚 ملفات SQL المطلوبة

1. `prisma/migrations/neon_init.sql` - إنشاء الجداول
2. `prisma/migrations/neon_seed_defaults.sql` - إدراج الإعدادات الافتراضية

---

**بعد إكمال جميع الخطوات، يجب أن يعمل الموقع بشكل صحيح! 🎉**
