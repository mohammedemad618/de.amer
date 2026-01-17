# إصلاح خطأ Internal Server Error على Netlify

## المشكلة
بعد رفع المشروع على Netlify بنجاح، تظهر رسالة "Internal Server Error" عند زيارة الموقع.

## السبب
المشكلة بسبب عدم وجود `DATABASE_URL` أو `NETLIFY_DATABASE_URL` في Netlify Environment Variables.

## الحل

### 1. الحصول على Neon Database Connection String

1. افتح [Neon Console](https://console.neon.tech/)
2. اختر مشروعك (أو أنشئ مشروعاً جديداً)
3. اذهب إلى **Dashboard** → **Connection Details**
4. انسخ **Connection String** (يبدأ بـ `postgresql://...`)

### 2. إضافة Environment Variables في Netlify

1. افتح [Netlify Dashboard](https://app.netlify.com/)
2. اختر موقعك (site)
3. اذهب إلى **Site settings** → **Environment variables**
4. أضف المتغيرات التالية:

#### متغيرات مطلوبة:

```env
DATABASE_URL=postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/database?sslmode=require
```

أو إذا كنت تستخدم Netlify Neon Integration:

```env
NETLIFY_DATABASE_URL=postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/database?sslmode=require
```

**ملاحظة:** يفضل استخدام `NETLIFY_DATABASE_URL` إذا كنت تستخدم Netlify Neon Integration.

#### متغيرات إضافية:

```env
JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-characters-long
NODE_ENV=production
```

### 3. تنفيذ SQL Migration

بعد إضافة `DATABASE_URL`، يجب تنفيذ SQL migration script في Neon Database:

1. افتح Neon Console → **SQL Editor**
2. انسخ محتوى `prisma/migrations/neon_init.sql`
3. نفّذ SQL في SQL Editor

أو استخدم Neon CLI:

```bash
psql "postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/database?sslmode=require" < prisma/migrations/neon_init.sql
```

### 4. إعادة Deploy

بعد إضافة Environment Variables:

1. اذهب إلى **Deploys** في Netlify Dashboard
2. انقر على **Trigger deploy** → **Clear cache and deploy site**

أو دفع commit جديد إلى GitHub (سيبدأ deploy تلقائياً).

### 5. التحقق من النجاح

بعد الـ deploy:

1. افتح موقعك على Netlify
2. يجب أن تظهر الصفحة الرئيسية بدون أخطاء
3. افتح Netlify Function logs للتحقق من عدم وجود أخطاء

## ملاحظات مهمة

- ⚠️ **لا تشارك `DATABASE_URL` أو `JWT_SECRET`** - هذه معلومات حساسة
- 🔒 تأكد من أن `JWT_SECRET` على الأقل 32 حرفاً
- 📝 في production، تأكد من إضافة جميع Environment Variables المطلوبة
- 🔄 بعد تغيير Environment Variables، يجب إعادة deploy الموقع

## استكشاف الأخطاء

### إذا استمرت المشكلة:

1. تحقق من **Function logs** في Netlify Dashboard:
   - اذهب إلى **Functions** → **View logs**
   - ابحث عن أخطاء Database connection

2. تحقق من صحة Connection String:
   - تأكد من أن Connection String يبدأ بـ `postgresql://`
   - تأكد من وجود `?sslmode=require` في النهاية

3. تحقق من أن Database Migration تم تنفيذه:
   - افتح Neon Console → **SQL Editor**
   - نفّذ: `SELECT * FROM systemsettings LIMIT 1;`
   - يجب أن يعمل بدون أخطاء

4. تحقق من Environment Variables:
   - في Netlify: **Site settings** → **Environment variables**
   - تأكد من أن `DATABASE_URL` أو `NETLIFY_DATABASE_URL` موجودة

## الدعم

إذا استمرت المشكلة، تحقق من:
- Netlify Function logs
- Neon Database connection logs
- Browser console errors
