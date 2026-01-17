export type CourseContent = {
  id: string
  title: string
  category: string
  description: string
  objectives: string[]
  hours: number
  price: number
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  thumbnail: string
}

export const coursesContent: CourseContent[] = [
  {
    id: 'nutrition-essentials',
    title: 'أساسيات التغذية العلاجية',
    category: 'التغذية السريرية',
    description: 'مقدمة شاملة في تقييم الحالة الغذائية والتخطيط العلاجي.',
    objectives: ['فهم تحليل الحالة الغذائية', 'بناء خطة غذائية علاجية', 'متابعة النتائج السريرية'],
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
    objectives: ['تحديد الاحتياجات المعقدة', 'إدارة حالات السكري والقلب', 'التواصل مع الفريق الطبي'],
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
    objectives: ['إدارة جلسة الاستشارة عن بعد', 'أدوات قياس المتابعة', 'زيادة الالتزام الغذائي'],
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
    objectives: ['فهم دور العلاج الوظيفي', 'تحليل الأنشطة اليومية', 'تصميم خطط بسيطة للتأهيل'],
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
    objectives: ['بناء برنامج تأهيلي شامل', 'قياس التحسن الوظيفي', 'دمج الأسرة في الخطة'],
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
    objectives: ['تقييم مخاطر العمل', 'تصميم تدخلات وقائية', 'التعاون مع إدارات الموارد البشرية'],
    hours: 9,
    price: 39,
    level: 'INTERMEDIATE',
    thumbnail: '/illustrations/medical/consultation-scene.webp'
  }
]


