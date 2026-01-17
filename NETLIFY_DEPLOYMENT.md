# دليل النشر على Netlify - منصة التعليم الطبي

هذا الدليل الشامل يوضح كيفية نشر المشروع على Netlify مع MongoDB.

## 📋 المتطلبات الأساسية

1. **حساب Netlify** (مجاني أو مدفوع)
2. **حساب MongoDB Atlas** (مجاني متاح)
3. **مستودع Git** (GitHub, GitLab, أو Bitbucket)

## 🔧 الخطوة 1: إعداد MongoDB Atlas

### 1.1 إنشاء قاعدة البيانات على MongoDB Atlas

1. قم بتسجيل الدخول إلى [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. تأكد من أن لديك cluster نشط
3. انقر على **"Connect"** بجوار cluster الخاص بك
4. اختر **"Connect your application"**
5. انسخ رابط الاتصال (Connection String)

### 1.2 بيانات الاتصال المتوفرة

```
Database User: mohammedemad123me_db_user
Password: Q74dIpOP8Vkd0bOP
Connection String: mongodb+srv://mohammedemad123me_db_user:Q74dIpOP8Vkd0bOP@cluster0.10zcwzy.mongodb.net/?appName=Cluster0
```

### 1.3 إعداد قاعدة البيانات

**مهم:** أضف اسم قاعدة البيانات إلى رابط الاتصال:

```
mongodb+srv://mohammedemad123me_db_user:Q74dIpOP8Vkd0bOP@cluster0.10zcwzy.mongodb.net/medical_education?retryWrites=true&w=majority
```

أو استخدم الاسم الذي تفضله للقاعدة.

### 1.4 السماح بعناوين IP (مهم جداً)

1. في MongoDB Atlas، انتقل إلى **Network Access**
2. انقر على **"Add IP Address"**
3. اختر **"Allow Access from Anywhere"** (0.0.0.0/0) للسماح بـ Netlify
   - أو أضف IP address المحدد لـ Netlify Functions إذا كان متاحاً

## 🚀 الخطوة 2: إعداد Netlify

### 2.1 إنشاء موقع جديد

1. قم بتسجيل الدخول إلى [Netlify Dashboard](https://app.netlify.com)
2. انقر على **"Add new site"** → **"Import an existing project"**
3. اختر مستودع Git الخاص بك (GitHub, GitLab, أو Bitbucket)
4. اختر المستودع `amarv1.3` أو اسم المستودع الخاص بك

### 2.2 إعداد Build Settings

Netlify سيكتشف تلقائياً إعدادات Next.js، لكن تأكد من:

- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Node version:** `20` (أو أحدث)

### 2.3 إضافة متغيرات البيئة

في صفحة إعدادات الموقع، انتقل إلى **"Site settings"** → **"Environment variables"** وأضف:

#### متغيرات البيئة المطلوبة:

| المفتاح | القيمة | الوصف |
|---------|--------|-------|
| `DATABASE_URL` | `mongodb+srv://mohammedemad123me_db_user:Q74dIpOP8Vkd0bOP@cluster0.10zcwzy.mongodb.net/medical_education?retryWrites=true&w=majority` | رابط اتصال MongoDB |
| `JWT_SECRET` | `your-super-secret-jwt-key-here-minimum-32-characters-long` | مفتاح JWT (يجب أن يكون على الأقل 32 حرفاً) |
| `NODE_ENV` | `production` | بيئة التشغيل |

**⚠️ تحذير أمني:** 
- استخدم `JWT_SECRET` قوي وفريد لكل بيئة
- لا تشارك `JWT_SECRET` أو `DATABASE_URL` في الكود العام

#### مثال على JWT_SECRET قوي:
```bash
openssl rand -base64 32
```

أو استخدم مولد كلمات مرور آمنة بطول 32 حرف على الأقل.

## 📦 الخطوة 3: إعداد المشروع للنشر

### 3.1 التأكد من الملفات المطلوبة

تأكد من وجود هذه الملفات في المشروع:

- ✅ `netlify.toml` (تم إنشاؤه)
- ✅ `package.json` (تم تحديثه)
- ✅ `prisma/schema.prisma` (محدث لـ MongoDB)
- ✅ `.gitignore` (يتضمن `.env`)

### 3.2 دفع التغييرات إلى Git

```bash
git add .
git commit -m "إعداد المشروع للنشر على Netlify"
git push origin main
```

### 3.3 الإعدادات الأولية للقاعدة (اختياري)

إذا كنت تريد إضافة بيانات تجريبية بعد النشر الأول:

1. في Netlify Dashboard، افتح **Functions** tab
2. استخدم **Deploy log** لتشغيل:

```bash
# محلياً قبل النشر، قم بتشغيل:
npx prisma db push
npm run prisma:seed
```

أو أنشئ Function في Netlify لتشغيل Seed مرة واحدة.

## 🔄 الخطوة 4: النشر

### 4.1 النشر التلقائي

بمجرد دفع الكود إلى Git:
1. Netlify سيبدأ البناء تلقائياً
2. ستجد Build Log في **Deploys** tab
3. انتظر حتى يكتمل البناء

### 4.2 التحقق من البناء

راقب Build Log وتأكد من:
- ✅ `prisma generate` يعمل بنجاح
- ✅ `next build` يكتمل بدون أخطاء
- ✅ لا توجد أخطاء في TypeScript أو ESLint

### 4.3 اختبار الموقع

بعد اكتمال النشر:
1. Netlify سيعطيك رابط مؤقت مثل: `https://random-name-123456.netlify.app`
2. افتح الموقع واختبر:
   - الصفحة الرئيسية
   - صفحات الدورات
   - صفحة تسجيل الدخول
   - API endpoints

## 🛠️ الخطوة 5: إعدادات إضافية

### 5.1 إعداد اسم مخصص (Custom Domain)

1. في Netlify Dashboard، انتقل إلى **Domain settings**
2. انقر على **"Add custom domain"**
3. اتبع التعليمات لإضافة اسم النطاق الخاص بك
4. قم بتحديث DNS records عند مزود النطاق

### 5.2 إعداد SSL (تلقائي)

Netlify يوفر شهادات SSL مجانية تلقائياً لجميع المواقع.

### 5.3 إعدادات الأمان

المشروع يتضمن بالفعل:
- ✅ CSP Headers
- ✅ X-Frame-Options
- ✅ CSRF Protection
- ✅ Rate Limiting

### 5.4 إعدادات البيئة للبيئات المختلفة

يمكنك إعداد متغيرات بيئة مختلفة لكل بيئة:

- **Production:** `NODE_ENV=production`
- **Branch deploys:** `NODE_ENV=development` (اختياري)

## 🐛 حل المشاكل الشائعة

### مشكلة 1: Prisma Client لم يتم توليده

**الخطأ:** `Cannot find module '@prisma/client'`

**الحل:**
1. تأكد من أن `postinstall` script موجود في `package.json`
2. تحقق من Build Log في Netlify
3. تأكد من أن `prisma generate` يعمل في `build` command

### مشكلة 2: خطأ في الاتصال بـ MongoDB

**الخطأ:** `Can't reach MongoDB server`

**الحل:**
1. تأكد من أن `DATABASE_URL` صحيح في Environment Variables
2. تحقق من Network Access في MongoDB Atlas
3. تأكد من أن IP addresses مسموح بها (0.0.0.0/0 للسماح للجميع)

### مشكلة 3: خطأ في JWT

**الخطأ:** `JWT_SECRET must be at least 32 characters`

**الحل:**
1. تأكد من أن `JWT_SECRET` في Environment Variables بطول 32 حرف على الأقل
2. تأكد من عدم وجود مسافات إضافية في القيمة

### مشكلة 4: Build Timeout

**الخطأ:** `Build exceeded maximum build time`

**الحل:**
1. قم بترقية خطة Netlify (Build time أطول في الخطط المدفوعة)
2. تحسين أوقات البناء بإزالة dependencies غير ضرورية
3. استخدام Build Plugins لتسريع البناء

### مشكلة 5: Functions Timeout

**الخطأ:** `Function execution timed out`

**الحل:**
1. في `netlify.toml`، قم بزيادة `timeout` في `[functions]`
2. تحسين أداء API routes
3. استخدام Background Functions للعمليات الطويلة

## 📊 مراقبة الأداء

### 6.1 Netlify Analytics (اختياري)

يمكنك تفعيل Analytics من Netlify Dashboard:
- **Site settings** → **Analytics**

### 6.2 MongoDB Atlas Monitoring

راقب استخدام MongoDB من Atlas Dashboard:
- **Metrics** tab لمراقبة الاستعلامات والأداء
- **Alerts** لإعداد تنبيهات تلقائية

## 🔐 الأمان الإضافي

### 7.1 تحديث JWT_SECRET بانتظام

قم بتغيير `JWT_SECRET` بانتظام خاصة إذا كنت تشك في تسريبه.

### 7.2 مراجعة Network Access

قم بمراجعة IP addresses المسموح بها في MongoDB Atlas بانتظام.

### 7.3 نسخ احتياطي للبيانات

قم بإعداد نسخ احتياطي تلقائي في MongoDB Atlas:
- **Backup** → **Cloud Backup**

## 📝 ملاحظات مهمة

1. **MongoDB Free Tier:**
   - 512 MB storage
   - Shared RAM
   - قد يكون هناك قيود على عدد الاتصالات

2. **Netlify Free Tier:**
   - 100 GB bandwidth/month
   - 300 build minutes/month
   - Functions: 125,000 invocations/month

3. **أداء Production:**
   - استخدم MongoDB Atlas M0 (Free) للتطوير
   - ترقية إلى M10+ للإنتاج الكبير

## 🎉 تم النشر بنجاح!

بعد اكتمال جميع الخطوات، موقعك سيكون متاحاً على:
- Netlify URL: `https://your-site-name.netlify.app`
- Custom Domain: `https://yourdomain.com` (إذا تم إعداده)

## 📞 الدعم

إذا واجهت أي مشاكل:
1. راجع Build Log في Netlify Dashboard
2. راجع Function Logs للـ API routes
3. تحقق من MongoDB Atlas logs
4. راجع Netlify [Documentation](https://docs.netlify.com/)

---

**آخر تحديث:** يناير 2025
**الإصدار:** 1.3
