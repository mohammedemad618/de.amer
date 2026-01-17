# 🚀 إعداد Neon Database للمشروع

## ⚠️ المشكلة الحالية

ملف `.env` يحتوي على MongoDB connection string، لكن المشروع الآن يستخدم **Neon PostgreSQL**.

## ✅ الحل - تحديث .env

### 1. احصل على Neon Connection String

1. افتح [Neon Dashboard](https://console.neon.tech/)
2. أنشئ مشروع جديد (أو استخدم مشروع موجود)
3. اذهب إلى **Dashboard** → **Connection Details**
4. انسخ **Connection String** (يبدأ بـ `postgresql://...`)

### 2. حدث ملف .env

افتح ملف `.env` في مجلد المشروع وحدثه:

```env
# استبدل MongoDB connection string بـ Neon PostgreSQL connection string
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/database?sslmode=require"

# أو استخدم NETLIFY_DATABASE_URL إذا كنت تستخدم Netlify
NETLIFY_DATABASE_URL="postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/database?sslmode=require"

# JWT Secret (32+ حرف)
JWT_SECRET="your-super-secret-jwt-key-here-minimum-32-characters-long"

# Node Environment
NODE_ENV="development"
```

### 3. تنفيذ SQL Migration

بعد تحديث `.env`، يجب تنفيذ SQL migration لإنشاء الجداول:

1. افتح **Neon Dashboard** → **SQL Editor**
2. انسخ محتوى ملف `prisma/migrations/neon_init.sql`
3. نفّذ الـ script

## 📋 مثال على Neon Connection String

```
postgresql://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## ⚠️ ملاحظات مهمة

1. **استبدال MongoDB**: المشروع الآن يستخدم PostgreSQL (Neon)، ليس MongoDB
2. **SSL Required**: تأكد من إضافة `?sslmode=require` في connection string
3. **Migration**: يجب تنفيذ SQL migration قبل استخدام التطبيق
4. **Development**: في حالة عدم وجود DATABASE_URL في development، سيستخدم placeholder (لن يعمل لكن لن يكسر التطبيق)

## ✅ بعد التحديث

1. ✅ حدث `.env` بـ Neon connection string
2. ✅ نفّذ SQL migration في Neon Database
3. ✅ أعد تشغيل dev server (`npm run dev`)
4. ✅ اختبر التطبيق

---

**تاريخ الإعداد:** 2025-01-17
