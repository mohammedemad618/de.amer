# Medical Education Platform

منصة تعليم طبي شاملة للمهنيين الصحيين في التغذية السريرية والعلاج الوظيفي باستخدام Next.js + React + TypeScript + TailwindCSS مع دعم RTL.

## المتطلبات
- Node.js 18+
- npm
- MongoDB Database (MongoDB Atlas أو MongoDB محلي)

## إعداد قاعدة البيانات
1) إنشاء ملف `.env` وأضف متغيرات البيئة:
```bash
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority"
JWT_SECRET="your-super-secret-jwt-key-here-minimum-32-characters-long"
NODE_ENV="development"
```

2) تثبيت الحزم:
```bash
npm install
```

3) توليد Prisma Client:
```bash
npm run prisma:generate
```

4) دفع schema إلى MongoDB (MongoDB لا يحتاج migrations مثل SQL):
```bash
npx prisma db push
```

5) تشغيل seed (بيانات تجريبية):
```bash
npm run prisma:seed
```

6) التشغيل:
```bash
npm run dev
```

> **ملاحظة**: المشروع يستخدم **MongoDB** كقاعدة بيانات. تأكد من إضافة رابط الاتصال الصحيح في ملف `.env`.

## استبدال الرسوم التوضيحية
الرسوم التوضيحية الحالية هي Placeholder فقط:
- `public/illustrations/medical/doctor-clipboard.webp`
- `public/illustrations/medical/nutritionist.webp`
- `public/illustrations/medical/occupational-therapy.webp`
- `public/illustrations/medical/consultation-scene.webp`

التعليمات:
1) استبدل الصور الحالية بأخرى عالية الجودة.
2) أضف معلومات الصور الجديدة إلى الملف `src/content/illustrations.ts`.
3) تأكد من وضع الصور في المجلد المحدد.

## أمان النظام
- Access Token و Refresh Token يتم تخزينهما في Cookies بشكل httpOnly.
- Access Token يتم تجديده تلقائياً و Refresh Token يتم تحديثه عبر `/api/auth/refresh`.
- نظام Rate Limiting يمنع محاولات الدخول المتكررة (10 محاولات كل 10 دقائق لكل IP).
- حماية CSRF باستخدام Double Submit Token (Cookie + Header `x-csrf-token`).
- إعدادات أمان متقدمة في `next.config.mjs`.

> **ملاحظة أمنية**: لا يتم حفظ Refresh Token كـ Hash في قاعدة البيانات. يمكنك تحسين هذا بإضافة Hash قبل الحفظ.

## قاعدة البيانات
- المشروع يستخدم **MongoDB** كقاعدة بيانات.
- حقل `objectives` يتم تخزينه كـ JSON في MongoDB.

## إمكانية الوصول (WCAG 2.1 AA)
- رابط تخطي المحتوى (Skip to content).
- دعم لوحة المفاتيح.
- تباين ألوان مناسب للنصوص لعرض أفضل للمستخدمين.
- تسميات حقول واضحة.

## صفحات الموقع
- الصفحات العامة المتاحة: `/`, `/about`, `/courses`, `/contact`, `/dashboard`.
- RTL مدعوم بالكامل.
- مكونات واجهة المستخدم في `src/components/ui/`.
- تصميم متجاوب بالكامل.
- نظام تقدم متقدم للمستخدمين.
- إنشاء شهادات PDF باستخدام `pdf-lib`.
- نظام إدارة كامل في صفحة "لوحة التحكم".
