import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'
import { CoursesClient } from '@/components/courses/courses-client'
import type { CourseSummary } from '@/components/courses/course-card'
import { SectionHeading } from '@/components/ui/section-heading'
import { MedicalIllustration } from '@/components/illustrations/medical-illustration'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { Stagger, StaggerItem } from '@/components/ui/stagger'
import { getSetting, type CurrencyCode } from '@/lib/settings'

export const dynamic = 'force-dynamic'

// إحصائيات ثابتة - يمكن نقلها للإعدادات لاحقاً
const stats = [
  { value: '12+ دورة', label: 'مسارات تخصصية في التغذية والعلاج الوظيفي' },
  { value: 'خبرة ممتدة', label: 'محتوى مبني على ممارسات مهنية حديثة' },
  { value: 'تعلم مرن', label: 'إمكانية المتابعة حسب وقتك' }
]

const highlights = [
  {
    title: 'محتوى تطبيقي',
    desc: 'دروس تركّز على الحالات الواقعية وتشرح خطوات التعامل معها.'
  },
  {
    title: 'أدوات جاهزة',
    desc: 'نماذج واستبيانات تساعدك على تنظيم العمل بسرعة.'
  },
  {
    title: 'متابعة واضحة',
    desc: 'خطة تعلم منظمة تساعدك على قياس التقدم باستمرار.'
  }
]

export default async function CoursesPage() {
  const [courses, defaultCurrency] = await Promise.all([
    prisma.course.findMany({ orderBy: { createdAt: 'desc' } }),
    getSetting('default_currency', 'USD') as Promise<string>
  ])

  const list: CourseSummary[] = courses.map((course) => ({
    id: course.id,
    title: course.title,
    category: course.category,
    description: course.description,
    hours: course.hours,
    price: course.price,
    level: (course.level === 'ADVANCED' || course.level === 'INTERMEDIATE' || course.level === 'BEGINNER'
      ? course.level
      : 'BEGINNER') as CourseSummary['level'],
    thumbnail: course.thumbnail
  }))

  const currency = (defaultCurrency === 'USD' || defaultCurrency === 'SYP' || defaultCurrency === 'EUR'
    ? defaultCurrency
    : 'USD') as CurrencyCode

  return (
    <div className='space-y-16 pb-16'>
      <section className='relative overflow-hidden bg-hero-gradient'>
        <div
          className='pointer-events-none absolute -left-24 top-10 h-40 w-40 rounded-full bg-accent-green/25 blur-3xl'
          aria-hidden='true'
        />
        <div
          className='pointer-events-none absolute -right-32 bottom-0 h-56 w-56 rounded-full bg-accent-turquoise/25 blur-3xl'
          aria-hidden='true'
        />
        <div className='mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]'>
          <Reveal className='space-y-6'>
            <p className='text-sm font-semibold text-primary'>مسارات تدريبية احترافية</p>
            <h1 className='text-3xl font-bold leading-tight text-neutral-900 md:text-5xl'>الدورات التدريبية</h1>
            <p className='text-lg text-neutral-600'>
              اكتشف مسارات مصممة بعناية لتطوير مهاراتك في التغذية العلاجية والعلاج الوظيفي بخطة واضحة ومنظمة.
            </p>
            <div className='flex flex-wrap gap-3'>
              <Button asChild>
                <Link href='#courses-list'>استعرض الدورات</Link>
              </Button>
              <Button asChild variant='outline'>
                <Link href='/contact'>تواصل للاستشارة</Link>
              </Button>
            </div>
          </Reveal>
          <Reveal className='space-y-4' delay={0.15}>
            <div className='relative h-64 w-full'>
              <MedicalIllustration id='nutritionist' />
            </div>
            <Stagger className='grid gap-4 sm:grid-cols-2'>
              {stats.map((item) => (
                <StaggerItem key={item.label}>
                  <Card variant='glass' className='space-y-2'>
                    <p className='text-lg font-bold text-neutral-900'>{item.value}</p>
                    <p className='text-xs text-neutral-600'>{item.label}</p>
                  </Card>
                </StaggerItem>
              ))}
            </Stagger>
          </Reveal>
        </div>
      </section>

      <section className='mx-auto max-w-6xl space-y-8 px-6'>
        <SectionHeading title='لماذا تختار دوراتنا؟' subtitle='تصميم تعليمي متوازن بين المعرفة النظرية والتطبيق العملي.' />
        <div className='grid gap-6 md:grid-cols-3'>
          {highlights.map((item) => (
            <Card key={item.title} variant='elevated' className='space-y-3'>
              <p className='text-sm font-semibold text-primary'>{item.title}</p>
              <p className='text-sm text-neutral-600'>{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id='courses-list' className='mx-auto max-w-6xl px-6'>
        <CoursesClient courses={list} currency={currency} />
      </section>

      <section className='mx-auto max-w-6xl px-6'>
        <Card
          variant='glass'
          className='grid items-center gap-8 border border-white/70 bg-mesh p-8 md:grid-cols-[1.1fr_0.9fr]'
        >
          <div className='space-y-3'>
            <p className='text-sm font-semibold text-primary'>تحتاج مساعدة في اختيار المسار؟</p>
            <p className='text-2xl font-bold text-neutral-900'>دعنا نرشح لك الدورة الأنسب حسب خبرتك وهدفك المهني.</p>
            <p className='text-sm text-neutral-600'>نساعدك في بناء خطة تعلم واضحة تتناسب مع وقتك الحالي.</p>
            <div className='flex flex-wrap gap-3'>
              <Button asChild>
                <Link href='/contact'>تواصل معنا</Link>
              </Button>
              <Button asChild variant='outline'>
                <Link href='/about'>تعرف علينا</Link>
              </Button>
            </div>
          </div>
          <div className='relative h-52 w-full'>
            <MedicalIllustration id='consultationScene' />
          </div>
        </Card>
      </section>
    </div>
  )
}
