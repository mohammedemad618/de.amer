# واجهة المستخدم (Frontend) - بنية النظام والوظائف

## 📋 نظرة عامة

منصة تعليمية طبية مبنية على **Next.js 16** مع **React 19** و**TypeScript**، تعتمد على **Server Components** و**Client Components** لتوفير تجربة مستخدم سلسة.

## 🏗️ البنية المعمارية

### 1. الهيكل الأساسي للمشروع

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout الرئيسي
│   ├── page.tsx           # الصفحة الرئيسية
│   ├── globals.css        # الأنماط العامة
│   ├── auth/              # صفحات المصادقة
│   ├── courses/           # صفحات الدورات
│   ├── dashboard/         # لوحة تحكم الطالب
│   ├── admin/             # لوحة تحكم المسؤول
│   └── api/               # API Routes
│
├── components/            # المكونات القابلة لإعادة الاستخدام
│   ├── ui/               # مكونات UI الأساسية
│   ├── layout/           # مكونات التخطيط
│   ├── courses/          # مكونات الدورات
│   ├── dashboard/        # مكونات لوحة التحكم
│   └── admin/            # مكونات الإدارة
│
├── lib/                   # مكتبات مساعدة
│   ├── auth/             # نظام المصادقة
│   ├── db/               # Prisma Client
│   ├── config/           # إعدادات التطبيق
│   └── security/         # الأمان (CSRF, Rate Limit)
│
└── theme/                 # إعدادات التصميم
```

---

## 🎨 نظام التصميم (Design System)

### الألوان الأساسية

```typescript
// src/theme/tokens.ts
{
  primary: '#6366F1',        // الأزرق الأساسي
  accent: {
    purple: '#7C3AED',       // البنفسجي
    green: '#10B981',        // الأخضر
    orange: '#F59E0B',       // البرتقالي
    red: '#EF4444',          // الأحمر
    turquoise: '#14B8A6'     // التركواز
  },
  neutral: {                 // الألوان المحايدة
    50: '#F9FAFB',
    100: '#F3F4F6',
    // ... حتى 900
  }
}
```

### المكونات الأساسية (UI Components)

#### 1. **Button** (`src/components/ui/button.tsx`)
- Variants: `primary`, `secondary`, `outline`, `ghost`, `success`
- Sizes: `sm`, `md`, `lg`
- يدعم `asChild` للربط مع `Link`

#### 2. **Card** (`src/components/ui/card.tsx`)
- Variants: `default`, `elevated`, `bordered`, `glass`
- تصميم مرن قابل للتخصيص

#### 3. **Input** (`src/components/ui/input.tsx`)
- Sizes: `sm`, `md`, `lg`
- States: `default`, `error`, `disabled`
- مع دعم `focus-ring` للوصولية

#### 4. **Badge** (`src/components/ui/badge.tsx`)
- Variants: `neutral`, `success`, `error`, `warning`, `info`

#### 5. **Alert** (`src/components/ui/alert.tsx`)
- Variants: `success`, `error`, `warning`, `info`

#### 6. **Toast** (`src/components/ui/toast.tsx`)
- نظام إشعارات محترف
- Variants: `success`, `error`, `warning`, `info`
- Animations: `slideInFromBottom`, `fadeIn`

---

## 📄 الصفحات الرئيسية

### 1. الصفحة الرئيسية (`src/app/page.tsx`)

**المكونات:**
- Hero Section مع عنوان وجزء مناوب
- إحصائيات (Stats) في بطاقات
- مسارات تدريبية (Training Tracks)
- المميزات (Features)
- قصة المنصة
- خطوات البدء
- آراء المتدربين (Testimonials)
- Call to Action

**التقنيات:**
- `Reveal` لحركات الظهور
- `Stagger` للحركات المتتالية
- `MedicalIllustration` للرسوم التوضيحية

### 2. صفحة الدورات (`src/app/courses/page.tsx`)

**المكونات:**
- Hero Section للدورات
- إحصائيات
- مميزات الدورات
- قائمة الدورات مع فلاتر
- Call to Action

**الميزات:**
- تصفية الدورات حسب:
  - الفئة (Category)
  - المستوى (Level)
  - نوع السعر (Free/Paid)
  - البحث (Search)
- عرض الأسعار بالعملات: USD, SYP, EUR

### 3. لوحة تحكم الطالب (`src/app/dashboard/page.tsx`)

**المكونات:**
- إحصائيات: الدورات المسجلة، النشطة، المكتملة، متوسط التقدم
- بطاقة الملف الشخصي
- إجراءات سريعة
- جدول الدورات المسجلة
- الشهادات (Certificates)
- سجل التقدم (Progress Timeline)

**البيانات المعروضة:**
- معلومات المستخدم
- الدورات المسجلة مع حالة التقدم
- الشهادات المستحقة
- Timeline للأنشطة

### 4. لوحة تحكم المسؤول (`src/app/admin/dashboard/page.tsx`)

**المكونات:**
- إحصائيات: إجمالي الدورات، المستخدمين، التسجيلات
- إجراءات سريعة:
  - إدارة الدورات
  - عرض الدورات
  - إعدادات النظام
- آخر الدورات المضافة

### 5. صفحة إدارة الدورات (`src/app/admin/courses/page.tsx`)

**الميزات:**
- عرض جميع الدورات
- إضافة دورة جديدة
- تعديل دورة موجودة
- حذف دورة
- إدارة الدروس لكل دورة
- رفع صور الدورة

### 6. صفحة الإعدادات (`src/app/admin/settings/page.tsx`)

**الميزات:**
- نظام Tabs للفئات:
  - عام (General)
  - معلومات الاتصال (Contact)
  - SEO
  - وسائل التواصل (Social)
  - الدورات (Courses)
- البحث والتصفية
- إضافة إعدادات مخصصة
- تحديث الإعدادات
- حذف الإعدادات المخصصة
- Validation لأنواع مختلفة من البيانات

---

## 🔐 نظام المصادقة

### البنية (`src/lib/auth/`)

#### 1. JWT Tokens (`jwt.ts`)
- `signAccessToken()`: إنشاء Access Token
- `signRefreshToken()`: إنشاء Refresh Token
- `verifyToken()`: التحقق من Token
- `getRefreshExpiryMs()`: حساب مدة Refresh Token

#### 2. Cookies (`cookies.ts`)
- `setAuthCookies()`: حفظ Tokens في Cookies
- `clearAuthCookies()`: حذف Cookies
- `ACCESS_COOKIE`, `REFRESH_COOKIE`: أسماء Cookies

#### 3. Guards (`guards.ts`)
- `getSessionUser()`: الحصول على المستخدم الحالي
- `requireAdmin()`: التأكد من صلاحيات المسؤول

#### 4. Refresh Store (`refreshStore.ts`)
- تخزين Refresh Tokens في قاعدة البيانات
- `storeRefreshToken()`: حفظ Token
- `findRefreshToken()`: البحث عن Token
- `deleteRefreshToken()`: حذف Token

### API Routes للمصادقة

#### POST `/api/auth/login`
- تسجيل الدخول
- التحقق من البريد وكلمة المرور
- إنشاء Access & Refresh Tokens
- Rate Limiting
- CSRF Protection

#### POST `/api/auth/register`
- إنشاء حساب جديد
- تشفير كلمة المرور
- إنشاء Tokens تلقائياً

#### POST `/api/auth/logout`
- تسجيل الخروج
- حذف Tokens من Cookies وقاعدة البيانات

#### POST `/api/auth/refresh`
- تحديث Access Token باستخدام Refresh Token

#### GET `/api/auth/csrf`
- الحصول على CSRF Token

---

## 📚 إدارة الدورات

### API Routes

#### GET `/api/courses`
- جلب جميع الدورات

#### GET `/api/courses/[id]`
- جلب دورة محددة

#### POST `/api/enroll`
- التسجيل في دورة
- التحقق من المستخدم
- إنشاء Enrollment

#### PATCH `/api/progress`
- تحديث تقدم الطالب
- تحديث حالة الإتمام
- إنشاء Certificate ID عند الإتمام

#### GET `/api/certificates/[courseId]`
- توليد شهادة PDF للطالب

### Admin API Routes

#### GET `/api/admin/courses`
- جلب جميع الدورات مع عدد التسجيلات

#### POST `/api/admin/courses`
- إنشاء دورة جديدة

#### PUT `/api/admin/courses/[id]`
- تحديث دورة

#### DELETE `/api/admin/courses/[id]`
- حذف دورة

#### GET `/api/admin/lessons`
- جلب دروس دورة معينة

#### POST `/api/admin/lessons`
- إضافة درس جديد

#### PUT `/api/admin/lessons/[id]`
- تحديث درس

#### DELETE `/api/admin/lessons/[id]`
- حذف درس

#### POST `/api/admin/upload`
- رفع صورة للدورة
- حفظ في `/public/uploads`

---

## ⚙️ إعدادات النظام

### API Routes

#### GET `/api/admin/settings`
- جلب جميع الإعدادات أو حسب الفئة

#### POST `/api/admin/settings`
- إنشاء أو تحديث إعداد

#### GET `/api/admin/settings/[key]`
- جلب إعداد محدد

#### DELETE `/api/admin/settings/[key]`
- حذف إعداد

### أنواع الإعدادات

1. **عام (General)**
   - `site_name`: اسم الموقع
   - `site_description`: وصف الموقع
   - `site_url`: رابط الموقع
   - `enable_registrations`: تفعيل التسجيلات

2. **معلومات الاتصال (Contact)**
   - `contact_email`: البريد الإلكتروني
   - `contact_phone`: رقم الهاتف
   - `contact_address`: العنوان

3. **SEO**
   - `meta_keywords`: الكلمات المفتاحية
   - `og_image`: صورة Open Graph

4. **وسائل التواصل (Social)**
   - `social_facebook`: رابط فيسبوك
   - `social_twitter`: رابط تويتر
   - `social_instagram`: رابط إنستغرام
   - `social_linkedin`: رابط لينكد إن

5. **الدورات (Courses)**
   - `max_enrollments_per_user`: حد التسجيل الأقصى
   - `default_currency`: العملة الافتراضية (USD, SYP, EUR)
   - `course_completion_threshold`: نسبة الإتمام المطلوبة

---

## 🛡️ الأمان (Security)

### 1. CSRF Protection (`src/lib/security/csrf.ts`)
- `createCsrfToken()`: إنشاء Token
- `verifyCsrf()`: التحقق من Token
- `setCsrfCookie()`: حفظ Token في Cookie

### 2. Rate Limiting (`src/lib/security/rateLimit.ts`)
- `rateLimit()`: التحكم في معدل الطلبات
- `getClientIp()`: الحصول على IP العميل
- يستخدم قاعدة البيانات لحفظ البيانات

### 3. Authentication Guards
- `getSessionUser()`: التحقق من الجلسة
- `requireAdmin()`: التحقق من صلاحيات المسؤول

---

## 🎭 المكونات التفاعلية

### 1. Reveal (`src/components/ui/reveal.tsx`)
- حركة ظهور للمكونات
- يدعم Delay

### 2. Stagger (`src/components/ui/stagger.tsx`)
- حركة متتالية للمكونات
- `Stagger`: الحاوية
- `StaggerItem`: العنصر

### 3. Medical Illustration (`src/components/illustrations/medical-illustration.tsx`)
- عرض الرسوم التوضيحية الطبية
- يدعم Lazy Loading

### 4. Butterflies Background (`src/components/background/butterflies-background.tsx`)
- خلفية متحركة للفراشات
- يستخدم Three.js

---

## 💾 قاعدة البيانات (Prisma Schema)

### النماذج الرئيسية

```prisma
User {
  id, name, email, passwordHash, role
  enrollments[], refreshTokens[]
}

Course {
  id, title, category, description, objectives
  hours, price, level, thumbnail, meetingLink
  enrollments[], lessons[]
}

Enrollment {
  id, userId, courseId, status, progressPercent
  certificateId, certificateUrl
}

Lesson {
  id, courseId, title, description, content
  order, duration, videoUrl, resources
}

SystemSettings {
  id, key, value, type, category
  updatedAt, updatedBy
}

RefreshToken {
  id, userId, token, expiresAt
}

RateLimit {
  id, ip, count, resetAt
}
```

---

## 🎯 الميزات الرئيسية

### للطلاب:
1. ✅ تصفح الدورات
2. ✅ التسجيل في الدورات
3. ✅ متابعة التقدم
4. ✅ الحصول على الشهادات
5. ✅ عرض سجل التقدم
6. ✅ لوحة تحكم شخصية

### للمسؤولين:
1. ✅ إدارة الدورات
2. ✅ إضافة وتعديل الدروس
3. ✅ رفع صور الدورات
4. ✅ إدارة إعدادات النظام
5. ✅ عرض الإحصائيات
6. ✅ إدارة المستخدمين (محتمل)

---

## 🚀 التقنيات المستخدمة

### Core:
- **Next.js 16** - App Router
- **React 19** - UI Library
- **TypeScript** - Type Safety

### Styling:
- **Tailwind CSS** - Utility-first CSS
- **tailwindcss-rtl** - دعم RTL

### Database:
- **Prisma** - ORM
- **SQLite** - قاعدة البيانات

### Authentication:
- **JWT** - Tokens
- **bcrypt** - تشفير كلمات المرور

### UI Libraries:
- **Framer Motion** - Animations
- **Radix UI** - Components
- **Three.js** - 3D Graphics

### Validation:
- **Zod** - Schema Validation
- **React Hook Form** - Form Management

### PDF Generation:
- **pdf-lib** - توليد الشهادات

---

## 📝 نمط الكود (Coding Patterns)

### Server Components vs Client Components

```typescript
// Server Component (افتراضي)
export default async function Page() {
  const data = await fetchData()
  return <div>{data}</div>
}

// Client Component (مع 'use client')
'use client'
export function ClientComponent() {
  const [state, setState] = useState()
  return <div>{state}</div>
}
```

### Authentication Pattern

```typescript
// في Server Component
const session = await getSessionUser()
if (!session) {
  redirect('/auth/login')
}

// في API Route
const session = await getSessionUser()
if (!session) {
  return NextResponse.json({ message: 'غير مصرح' }, { status: 401 })
}
```

### Error Handling

```typescript
try {
  // العملية
} catch (error) {
  console.error('خطأ:', error)
  toast('حدث خطأ', 'error')
}
```

---

## 🎨 الأنماط والتصميم

### Typography
- Font: **Cairo** (Google Fonts)
- Direction: **RTL**

### Spacing System
- 0, 1 (4px), 2 (8px), 3 (12px), 4 (16px), ...
- حتى 32 (128px)

### Shadows
- `shadow-soft`: ظل خفيف
- `shadow-glass`: ظل زجاجي

### Background Gradients
- `bg-hero-gradient`: تدرج للصفحة الرئيسية
- `bg-mesh`: خلفية شبكية

---

## 📦 الاعتماديات الرئيسية

```json
{
  "next": "^16.1.1",
  "react": "^19.2.3",
  "typescript": "^5.3.3",
  "@prisma/client": "^6.19.2",
  "tailwindcss": "^3.4.1",
  "framer-motion": "^10.16.16",
  "jsonwebtoken": "^9.0.2",
  "bcrypt": "^5.1.1",
  "zod": "^3.22.4",
  "react-hook-form": "^7.49.3"
}
```

---

## 🔄 سير العمل (Workflow)

### تسجيل الطالب في دورة:
1. المستخدم يضغط على "التسجيل"
2. الطلب يذهب إلى `/api/enroll`
3. التحقق من المصادقة
4. التحقق من CSRF
5. إنشاء Enrollment في قاعدة البيانات
6. إرجاع النتيجة
7. تحديث الواجهة

### تحديث التقدم:
1. المستخدم يكمل درس
2. الطلب يذهب إلى `/api/progress`
3. تحديث `progressPercent`
4. إذا وصل 100%، تحديث `status` إلى `COMPLETED`
5. إنشاء `certificateId` و `certificateUrl`

---

## 📱 Responsive Design

- **Mobile First** Approach
- Breakpoints:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px

### أمثلة:
```tsx
<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
  {/* محتوى */}
</div>
```

---

## 🎯 أفضل الممارسات

1. **Server Components** كلما أمكن
2. **Client Components** فقط عند الحاجة للتفاعل
3. **Type Safety** مع TypeScript
4. **Error Handling** شامل
5. **Accessibility** مع ARIA labels
6. **SEO** مع Metadata
7. **Performance** مع Lazy Loading
8. **Security** مع CSRF و Rate Limiting

---

## 📚 الملفات المرجعية

- `src/app/layout.tsx` - Layout الرئيسي
- `src/components/ui/` - مكونات UI
- `src/lib/auth/` - نظام المصادقة
- `src/lib/security/` - الأمان
- `prisma/schema.prisma` - نموذج قاعدة البيانات

---

## 🔮 التطوير المستقبلي

1. إشعارات في الوقت الفعلي
2. نظام الدفع
3. التقييمات والمراجعات
4. منتدى المناقشات
5. إشعارات البريد الإلكتروني
6. Dashboard للمدرسين
7. نظام الإشعارات
8. تطبيق Mobile

---

**آخر تحديث:** يناير 2025
**الإصدار:** 1.3.0
