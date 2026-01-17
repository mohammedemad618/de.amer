export type IllustrationSource = {
  id: string
  title: string
  assetPath: string
  usageLocations: string[]
}

export const medicalIllustrations: IllustrationSource[] = [
  {
    id: 'doctorClipboard',
    title: 'طبيب يحمل ملف المتابعة',
    assetPath: '/illustrations/medical/doctor-clipboard.webp',
    usageLocations: ['الصفحة الرئيسية - البطل', 'عن الطبيب - العنوان']
  },
  {
    id: 'nutritionist',
    title: 'أخصائي تغذية مع عناصر غذائية',
    assetPath: '/illustrations/medical/nutritionist.webp',
    usageLocations: ['الصفحة الرئيسية - الميزات']
  },
  {
    id: 'occupationalTherapy',
    title: 'جلسة علاج وظيفي',
    assetPath: '/illustrations/medical/occupational-therapy.webp',
    usageLocations: ['صفحة عن الطبيب - القسم التعريفي']
  },
  {
    id: 'consultationScene',
    title: 'مشهد استشارة طبية',
    assetPath: '/illustrations/medical/consultation-scene.webp',
    usageLocations: ['صفحة التواصل - البانر', 'الدورات - الحالة الفارغة']
  }
]

