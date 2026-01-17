# 🔧 إصلاح مشكلة DATABASE_URL أثناء البناء في Netlify

## المشكلة
```
❌ DATABASE_URL is required. Please add it to your .env file.
Error: Failed to collect page data for /_not-found
```

**السبب:** أثناء البناء في Netlify، الكود يحاول التحقق من `DATABASE_URL` ولكن قد لا يكون متاحاً بعد (أو لم يتم إضافته في Netlify Environment Variables).

## الحل

تم تعديل `src/lib/config/env.ts` ليكون أكثر مرونة أثناء البناء:

1. **أثناء البناء (`NEXT_PHASE === 'phase-production-build'`):**
   - إذا كان `DATABASE_URL` مفقوداً، نستخدم placeholder (لن يكسر البناء)
   - نعطي تحذير للمستخدم لإضافة `DATABASE_URL` في Netlify Environment Variables

2. **في Runtime (بعد البناء):**
   - `DATABASE_URL` مطلوب وإلزامي
   - إذا كان مفقوداً، سيتم إيقاف التطبيق مع رسالة خطأ واضحة

### ما تم تغييره:

**قبل (خطأ):**
```typescript
if (!databaseUrl) {
  throw new Error('DATABASE_URL is required...')
}
```

**بعد (صحيح):**
```typescript
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'

if (!databaseUrl && !isBuildPhase) {
  // في runtime، DATABASE_URL مطلوب
  throw new Error('DATABASE_URL is required...')
}

if (!databaseUrl && isBuildPhase) {
  // أثناء البناء، نستخدم placeholder
  console.warn('⚠ DATABASE_URL is missing during build...')
  process.env.DATABASE_URL = 'mongodb://placeholder:27017/placeholder'
}
```

## ⚠️ مهم جداً

**يجب إضافة `DATABASE_URL` في Netlify Environment Variables:**

1. افتح Netlify Dashboard
2. Site settings → Environment variables
3. أضف:
   - **Key:** `DATABASE_URL`
   - **Value:** `mongodb+srv://mohammedemad123me_db_user:Q74dIpOP8Vkd0bOP@cluster0.10zcwzy.mongodb.net/medical_education?retryWrites=true&w=majority`

بدون هذا، التطبيق سيبني بنجاح لكن **لن يعمل** في runtime لأن `DATABASE_URL` سيكون placeholder.

## ملاحظات

- أثناء البناء، التطبيق يستخدم placeholder حتى لا يفشل البناء
- في runtime، `DATABASE_URL` مطلوب وإلزامي
- يجب إضافة `DATABASE_URL` في Netlify Environment Variables قبل أول نشر

---

## التحقق

بعد هذا الإصلاح:
1. ✅ تم تعديل `env.ts` ليكون أكثر مرونة أثناء البناء
2. ✅ تم رفع التحديث إلى GitHub
3. ⏳ Netlify سيعيد البناء تلقائياً
4. ⏳ البناء يجب أن ينجح الآن
5. ⚠️ **يجب إضافة `DATABASE_URL` في Netlify Environment Variables**

---

**تاريخ الإصلاح:** يناير 2025
