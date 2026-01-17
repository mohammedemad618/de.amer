# 🔧 حل مشكلة Environment Variables

## المشكلة
خطأ: `DATABASE_URL: Required`

## الحل

### 1. تأكد من وجود ملف `.env`

ملف `.env` يجب أن يحتوي على:

```env
DATABASE_URL=mongodb+srv://mohammedemad123me_db_user:Q74dIpOP8Vkd0bOP@cluster0.10zcwzy.mongodb.net/medical_education?retryWrites=true&w=majority
JWT_SECRET=temp-jwt-secret-for-development-minimum-32-chars-long
NODE_ENV=development
```

### 2. إذا كان ملف `.env` غير موجود

أنشئ ملف `.env` في جذر المشروع (`C:\Users\moham\Desktop\amarv1.3\.env`)

### 3. إعادة تشغيل Dev Server

بعد إنشاء/تحديث ملف `.env`:
1. أوقف dev server (Ctrl+C)
2. أعد تشغيله: `npm run dev`

---

## تم إصلاح الكود

تم تحديث `src/lib/config/env.ts` ليكون أكثر وضوحاً في قراءة `DATABASE_URL` من `process.env`.

---

## للتحقق

افتح Terminal وجرب:
```bash
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL)"
```

إذا ظهر رابط MongoDB، فملف `.env` يعمل بشكل صحيح.
