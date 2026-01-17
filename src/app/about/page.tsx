import Link from 'next/link'
import { MedicalIllustration } from '@/components/illustrations/medical-illustration'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SectionHeading } from '@/components/ui/section-heading'
import { Reveal } from '@/components/ui/reveal'
import { Stagger, StaggerItem } from '@/components/ui/stagger'
import { getSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'

const stats = [
  { value: '20+ سنة', label: 'خبرة سريرية وتعليمية' },
  { value: '1200+ ساعة', label: 'تدريب وإرشاد مهني' },
  { value: '300+ متدرب', label: 'انضموا لمساراتنا' }
]

const credentials = [
  'خبرة ممتدة في التغذية العلاجية وإدارة الحالات المزمنة.',
  'تصميم برامج تدريبية للعلاج الوظيفي تعتمد على التطبيق العملي.',
  'متابعة المتدربين بخطط تعلم قابلة للقياس والتحسين.',
  'تقديم استشارات عن بعد لدعم تطبيق المهارات في الواقع.'
]

const focusAreas = [
  {
    title: 'التغذية العلاجية',
    desc: 'خطط غذائية علاجية وتحليل احتياجات المرضى بشكل مهني.'
  },
  {
    title: 'العلاج الوظيفي',
    desc: 'برامج إعادة تأهيل وتحسين الأداء الوظيفي في الحياة اليومية.'
  },
  {
    title: 'الاستشارات عن بعد',
    desc: 'منهجيات فعالة للتواصل والمتابعة مع العملاء أونلاين.'
  }
]

const values = [
  {
    title: 'المصداقية',
    desc: 'نعتمد على مصادر علمية موثوقة ونتجنب المعلومات غير الدقيقة.'
  },
  {
    title: 'التطبيق العملي',
    desc: 'نحوّل المعرفة إلى أدوات واضحة قابلة للاستخدام مباشرة.'
  },
  {
    title: 'الدعم المستمر',
    desc: 'نرافق المتدرب حتى يصل إلى نتائج ملموسة.'
  },
  {
    title: 'التعلم المرن',
    desc: 'مسارات تناسب جدولك اليومي مع تقدم محفوظ.'
  }
]

export default async function AboutPage() {
  const settings = await getSettings([
    'site_name',
    'site_description'
  ])
  
  const siteName = (settings.site_name as string) || 'أمار للتعليم الطبي'
  const siteDescription = (settings.site_description as string) || 'منصة عربية يقودها مختصون في التغذية العلاجية والعلاج الوظيفي بخبرات عملية ممتدة.'

  return (
    <div className='space-y-16 pb-16'>
      <section className='relative overflow-hidden bg-hero-gradient'>
        <div
          className='pointer-events-none absolute -left-24 top-10 h-40 w-40 rounded-full bg-accent-purple/20 blur-3xl'
          aria-hidden='true'
        />
        <div
          className='pointer-events-none absolute -right-32 bottom-0 h-56 w-56 rounded-full bg-accent-turquoise/25 blur-3xl'
          aria-hidden='true'
        />
        <div className='mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2'>
          <Reveal className='space-y-6'>
            <p className='text-sm font-semibold text-primary'>من نحن</p>
            <h1 className='text-3xl font-bold text-neutral-900 md:text-5xl'>{siteName}</h1>
            <p className='text-lg text-neutral-600'>
              {siteDescription}
            </p>
            <div className='flex flex-wrap gap-3'>
              <Button asChild>
                <Link href='/contact'>تواصل معنا</Link>
              </Button>
              <Button asChild variant='outline'>
                <Link href='/courses'>استعرض الدورات</Link>
              </Button>
            </div>
          </Reveal>
          <Reveal className='relative h-72 w-full' delay={0.1}>
            <MedicalIllustration id='doctorClipboard' />
          </Reveal>
        </div>
      </section>

      <section className='mx-auto max-w-6xl px-6'>
        <Stagger className='grid gap-4 md:grid-cols-3'>
          {stats.map((item) => (
            <StaggerItem key={item.label}>
              <Card variant='glass' className='space-y-2'>
                <p className='text-2xl font-bold text-neutral-900'>{item.value}</p>
                <p className='text-sm text-neutral-600'>{item.label}</p>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className='mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[1.1fr_0.9fr]'>
        <Card variant='elevated' className='space-y-4'>
          <SectionHeading
            title='نبذة مهنية'
            subtitle='نركز على تقديم تعليم عملي يساعدك على اتخاذ قرارات مهنية بثقة.'
          />
          <ul className='space-y-2 text-sm text-neutral-600'>
            {credentials.map((line) => (
              <li key={line} className='flex items-start gap-2'>
                <span className='mt-1 h-2 w-2 rounded-full bg-primary' aria-hidden='true' />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card variant='bordered' className='space-y-4'>
          <p className='text-sm font-semibold text-neutral-800'>مجالات التركيز</p>
          <div className='space-y-3'>
            {focusAreas.map((area) => (
              <div key={area.title}>
                <p className='text-sm font-semibold text-neutral-900'>{area.title}</p>
                <p className='text-sm text-neutral-600'>{area.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className='mx-auto max-w-6xl space-y-8 px-6'>
        <SectionHeading
          title='قيمنا التعليمية'
          subtitle='نلتزم بتجربة تعلم عملية مبنية على المهنية والدعم المستمر.'
        />
        <Stagger className='grid gap-6 md:grid-cols-2'>
          {values.map((value) => (
            <StaggerItem key={value.title}>
              <Card variant='bordered' className='space-y-3'>
                <p className='text-sm font-semibold text-neutral-800'>{value.title}</p>
                <p className='text-sm text-neutral-600'>{value.desc}</p>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className='mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2'>
        <Reveal className='relative h-72 w-full'>
          <MedicalIllustration id='occupationalTherapy' />
        </Reveal>
        <Reveal className='space-y-4' delay={0.1}>
          <SectionHeading
            title='نرافقك حتى النتائج'
            subtitle='نساعدك على بناء خطة تعلم واضحة وتطبيقها بثقة في بيئة العمل.'
          />
          <p className='text-sm text-neutral-600'>
            سواء كنت في بداية مسارك أو ترغب بتطوير خبراتك، ستجد لدينا المسار المناسب والدعم المستمر.
          </p>
          <Button asChild variant='secondary'>
            <Link href='/contact'>احجز استشارة</Link>
          </Button>
        </Reveal>
      </section>
    </div>
  )
}
