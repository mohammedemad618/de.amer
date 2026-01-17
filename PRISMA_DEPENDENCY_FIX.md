# 🔧 إصلاح مشكلة Prisma في Netlify Build

## المشكلة
```
> prisma generate
sh: 1: prisma: not found
npm error command failed
npm error command sh -c prisma generate
```

**السبب:** في Netlify، عندما يكون `NODE_ENV=production`، فإن `devDependencies` لا يتم تثبيتها. لكن `prisma` كان موجود في `devDependencies`، بينما `postinstall` script يحاول تشغيل `prisma generate`.

## الحل

تم نقل `prisma` من `devDependencies` إلى `dependencies` لأنه:
- ✅ مطلوب في production لتوليد Prisma Client
- ✅ `postinstall` script يحتاج `prisma generate` بعد `npm install`
- ✅ `build` script يحتاج `prisma generate` قبل `next build`

### ما تم تغييره:

**قبل (خطأ):**
```json
{
  "dependencies": {
    "@prisma/client": "^6.19.2",
    ...
  },
  "devDependencies": {
    "prisma": "^6.19.2",  // ❌ خطأ - لن يُثبت في production
    ...
  }
}
```

**بعد (صحيح):**
```json
{
  "dependencies": {
    "@prisma/client": "^6.19.2",
    "prisma": "^6.19.2",  // ✅ صحيح - سيُثبت في production
    ...
  },
  "devDependencies": {
    ...
  }
}
```

## ملاحظات

- `prisma` CLI مطلوب في production لتوليد Prisma Client
- `@prisma/client` يجب أن يكون في `dependencies` دائماً
- في Netlify، `devDependencies` لا تُثبت عندما `NODE_ENV=production`

---

## التحقق

بعد هذا الإصلاح:
1. ✅ تم نقل `prisma` إلى `dependencies`
2. ✅ تم رفع التحديث إلى GitHub
3. ⏳ Netlify سيعيد البناء تلقائياً
4. ⏳ `prisma generate` يجب أن يعمل الآن بدون أخطاء

---

**تاريخ الإصلاح:** يناير 2025
