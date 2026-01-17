import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const serializeObjectives = (objectives: string[]) => JSON.stringify(objectives)

const courses = [
  {
    id: 'nutrition-essentials',
    title: 'أساسيات التغذية العلاجية',
    category: 'التغذية السريرية',
    description: 'مقدمة شاملة في تقييم الحالة الغذائية والتخطيط العلاجي.',
    objectives: serializeObjectives(['فهم تحليل الحالة الغذائية', 'بناء خطة غذائية علاجية', 'متابعة النتائج السريرية']),
    hours: 8,
    price: 0,
    level: 'BEGINNER',
    thumbnail: '/illustrations/medical/nutritionist.webp'
  },
  {
    id: 'clinical-nutrition-advanced',
    title: 'التغذية السريرية المتقدمة',
    category: 'التغذية السريرية',
    description: 'تطبيق بروتوكولات التغذية لمرضى الحالات المزمنة.',
    objectives: serializeObjectives(['تحديد الاحتياجات المعقدة', 'إدارة حالات السكري والقلب', 'التواصل مع الفريق الطبي']),
    hours: 12,
    price: 49,
    level: 'INTERMEDIATE',
    thumbnail: '/illustrations/medical/doctor-clipboard.webp'
  },
  {
    id: 'nutrition-teleconsult',
    title: 'استشارات التغذية عبر الإنترنت',
    category: 'التغذية السريرية',
    description: 'بناء تجربة استشارية فعالة عبر القنوات الرقمية.',
    objectives: serializeObjectives(['إدارة جلسة الاستشارة عن بعد', 'أدوات قياس المتابعة', 'زيادة الالتزام الغذائي']),
    hours: 6,
    price: 29,
    level: 'BEGINNER',
    thumbnail: '/illustrations/medical/consultation-scene.webp'
  },
  {
    id: 'occupational-therapy-core',
    title: 'مدخل إلى العلاج الوظيفي',
    category: 'العلاج الوظيفي',
    description: 'أساسيات العلاج الوظيفي وتقييم القدرة الوظيفية.',
    objectives: serializeObjectives(['فهم دور العلاج الوظيفي', 'تحليل الأنشطة اليومية', 'تصميم خطط بسيطة للتأهيل']),
    hours: 10,
    price: 0,
    level: 'BEGINNER',
    thumbnail: '/illustrations/medical/occupational-therapy.webp'
  },
  {
    id: 'rehab-programs',
    title: 'برامج التأهيل المتقدم',
    category: 'العلاج الوظيفي',
    description: 'تصميم برامج تأهيلية متعددة التخصصات.',
    objectives: serializeObjectives(['بناء برنامج تأهيلي شامل', 'قياس التحسن الوظيفي', 'دمج الأسرة في الخطة']),
    hours: 14,
    price: 65,
    level: 'ADVANCED',
    thumbnail: '/illustrations/medical/occupational-therapy.webp'
  },
  {
    id: 'occupational-therapy-workplace',
    title: 'العلاج الوظيفي في بيئات العمل',
    category: 'العلاج الوظيفي',
    description: 'التعامل مع الإصابات المهنية وإعادة الدمج الوظيفي.',
    objectives: serializeObjectives(['تقييم مخاطر العمل', 'تصميم تدخلات وقائية', 'التعاون مع إدارات الموارد البشرية']),
    hours: 9,
    price: 39,
    level: 'INTERMEDIATE',
    thumbnail: '/illustrations/medical/consultation-scene.webp'
  }
]

async function main() {
  // إنشاء الدورات
  for (const course of courses) {
    await prisma.course.upsert({
      where: { id: course.id },
      update: course,
      create: course
    })
  }

  // إنشاء مستخدم تجريبي
  const testPassword = await bcrypt.hash('test123456', 10)
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      name: 'مستخدم تجريبي',
      email: 'test@example.com',
      passwordHash: testPassword,
      role: 'USER'
    }
  })

  // إنشاء مستخدم مسؤول تجريبي
  const adminPassword = await bcrypt.hash('admin123456', 10)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'مسؤول النظام',
      email: 'admin@example.com',
      passwordHash: adminPassword,
      role: 'ADMIN'
    }
  })

  console.log('✅ تم إنشاء المستخدمين التجريبيين:')
  console.log('   المستخدم العادي:')
  console.log('     البريد الإلكتروني: test@example.com')
  console.log('     كلمة المرور: test123456')
  console.log('   المسؤول:')
  console.log('     البريد الإلكتروني: admin@example.com')
  console.log('     كلمة المرور: admin123456')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
