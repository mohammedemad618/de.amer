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
  { value: '20+ سنة', label: 'خبرة سريرية وتعليمية ممتدة' },
  { value: '12+ دورة', label: 'مسارات متخصصة بعمق تطبيقي' },
  { value: '100% عملي', label: 'خطط قابلة للتنفيذ في الواقع' }
]

const tracks = [
  {
    title: 'التغذية العلاجية',
    meta: 'مبتدئ - متوسط',
    desc: 'خطط غذائية للحالات المزمنة مع أدوات تقييم واضحة وعملية.'
  },
  {
    title: 'العلاج الوظيفي',
    meta: 'متوسط - متقدم',
    desc: 'استراتيجيات مهنية لتحسين الأداء اليومي وبرامج التأهيل.'
  },
  {
    title: 'الاستشارات عن بعد',
    meta: 'مسار قصير',
    desc: 'مهارات التواصل والمتابعة الفعالة مع عملائك أونلاين.'
  }
]

const steps = [
  {
    step: '01',
    title: 'اختر المسار المناسب',
    desc: 'تصفح الدورات واعرف المستوى الذي يلائم خبرتك الحالية.'
  },
  {
    step: '02',
    title: 'ابدأ التعلّم العملي',
    desc: 'تطبيقات واقعية وتمارين تساعدك على تثبيت المهارة.'
  },
  {
    step: '03',
    title: 'احصل على شهادة',
    desc: 'أكمل المسار لتحصل على شهادة توثق تقدمك المهني.'
  }
]

const testimonials = [
  {
    name: 'سمر عبد الله',
    role: 'أخصائية تغذية علاجية',
    quote: 'المحتوى عملي وساعدني على تحسين خطط التغذية للحالات المزمنة بسرعة.'
  },
  {
    name: 'ريم حسن',
    role: 'أخصائية علاج وظيفي',
    quote: 'أحببت الأدوات الجاهزة التي وفرت علي وقتاً كبيراً في المتابعة.'
  },
  {
    name: 'محمد خليل',
    role: 'متدرب حديث',
    quote: 'الخطة التعليمية واضحة ومنظمة، شعرت بتقدم حقيقي بعد كل جلسة.'
  }
]

const features = [
  {
    title: 'محتوى تطبيقي',
    desc: 'نحوّل المعرفة النظرية إلى خطوات عملية قابلة للتنفيذ فوراً.',
    accentClass: 'text-accent-purple'
  },
  {
    title: 'أدوات جاهزة',
    desc: 'نماذج واستبيانات تساعدك على تنظيم العمل والمتابعة.',
    accentClass: 'text-accent-turquoise'
  },
  {
    title: 'متابعة مهنية',
    desc: 'نرافقك حتى تحقق نتائج قابلة للقياس في عملك اليومي.',
    accentClass: 'text-accent-green'
  }
]

export default async function HomePage() {
  const settings = await getSettings([
    'site_name',
    'site_description',
    'contact_phone',
    'site_url'
  ])
  
  const siteName = (settings.site_name as string) || 'أمار للتعليم الطبي'
  const siteDescription = (settings.site_description as string) || 'منصة عربية تمزج بين الخبرة الأكاديمية والتطبيق الواقعي في التغذية العلاجية والعلاج الوظيفي.'
  const contactPhone = (settings.contact_phone as string) || '+00963985391696'
  const siteUrl = (settings.site_url as string) || 'https://example.com'

  const heroHeadline = 'طوّر مهاراتك السريرية بخطة تعلم عملية وموجهة.'
  const heroSubheadline = `${siteName} منصة عربية تمزج بين الخبرة الأكاديمية والتطبيق الواقعي في التغذية العلاجية والعلاج الوظيفي.`
  const heroCtaPrimary = 'استعرض الدورات'
  const heroCtaSecondary = 'احجز استشارة'

  // Organization schema for SEO
  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: contactPhone,
      contactType: 'customer service'
    }
  }

  return (
    <div className='space-y-20 pb-16'>
      <section className='relative overflow-hidden bg-hero-gradient'>
        <div
          className='pointer-events-none absolute -left-24 top-12 h-40 w-40 rounded-full bg-accent-purple/20 blur-3xl'
          aria-hidden='true'
        />
        <div
          className='pointer-events-none absolute -right-32 bottom-0 h-56 w-56 rounded-full bg-accent-turquoise/25 blur-3xl'
          aria-hidden='true'
        />
        <div className='mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2'>
          <Reveal className='space-y-6'>
            <p className='text-sm font-semibold text-primary'>تعليم طبي احترافي</p>
            <h1 className='text-3xl font-bold leading-tight text-neutral-900 md:text-5xl'>{heroHeadline}</h1>
            <p className='text-lg text-neutral-600'>{heroSubheadline || siteDescription}</p>
            <div className='flex flex-wrap gap-3'>
              <Button asChild>
                <Link href='/courses'>{heroCtaPrimary}</Link>
              </Button>
              <Button asChild variant='outline'>
                <Link href='/contact'>{heroCtaSecondary}</Link>
              </Button>
            </div>
          </Reveal>
          <Reveal className='relative h-80 w-full' delay={0.15}>
            <MedicalIllustration id='doctorClipboard' priority />
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

      <section className='mx-auto max-w-6xl space-y-8 px-6'>
        <SectionHeading
          title='مسارات تدريبية مركزة'
          subtitle='اختر المسار الذي يناسب خبرتك وتعلم بخطوات واضحة ومهارات قابلة للتطبيق.'
        />
        <div className='grid gap-6 md:grid-cols-3'>
          {tracks.map((track) => (
            <Card key={track.title} variant='elevated' className='space-y-3'>
              <div className='flex items-center justify-between'>
                <p className='text-lg font-bold text-neutral-900'>{track.title}</p>
                <span className='rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600'>
                  {track.meta}
                </span>
              </div>
              <p className='text-sm text-neutral-600'>{track.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className='mx-auto max-w-6xl space-y-8 px-6'>
        <SectionHeading
          title='لماذا تختار أمار؟'
          subtitle='تصميم تعليمي يوازن بين العمق العلمي والجاهزية العملية.'
        />
        <div className='grid gap-8 md:grid-cols-[1.2fr_0.8fr]'>
          <Stagger className='grid gap-6 md:grid-cols-3'>
            {features.map((item) => (
              <StaggerItem key={item.title}>
                <Card variant='elevated' className='space-y-4'>
                  <span className={`text-sm font-semibold ${item.accentClass}`}>{item.title}</span>
                  <p className='text-sm text-neutral-600'>{item.desc}</p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className='relative h-64 w-full' delay={0.1}>
            <MedicalIllustration id='nutritionist' />
          </Reveal>
        </div>
      </section>

      <section className='mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2'>
        <Reveal className='relative h-72 w-full'>
          <MedicalIllustration id='occupationalTherapy' />
        </Reveal>
        <Reveal className='space-y-4' delay={0.1}>
          <SectionHeading
            title='قصة تعليمية يقودها مختصون'
            subtitle='خبرة مهنية تمتد لأكثر من 20 عاماً في التدريب والاستشارات.'
          />
          <p className='text-sm text-neutral-600'>
            نرافق المتدربين في كل خطوة، من اختيار المسار حتى التطبيق العملي في بيئة العمل.
          </p>
          <Button variant='secondary' asChild>
            <Link href='/about'>تعرف علينا أكثر</Link>
          </Button>
        </Reveal>
      </section>

      <section className='mx-auto max-w-6xl space-y-8 px-6'>
        <SectionHeading title='كيف تبدأ رحلتك؟' subtitle='خطوات بسيطة تساعدك على الانضمام فوراً.' />
        <div className='grid gap-6 md:grid-cols-3'>
          {steps.map((step) => (
            <Card key={step.title} variant='bordered' className='space-y-4'>
              <p className='text-2xl font-bold text-primary'>{step.step}</p>
              <div className='space-y-2'>
                <p className='text-base font-semibold text-neutral-900'>{step.title}</p>
                <p className='text-sm text-neutral-600'>{step.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className='mx-auto max-w-6xl space-y-8 px-6'>
        <SectionHeading title='آراء المتدربين' subtitle='تجارب حقيقية من متخصصين انضموا لمساراتنا.' />
        <Stagger className='grid gap-6 md:grid-cols-3'>
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.name}>
              <Card variant='glass' className='space-y-4'>
                <p className='text-sm text-neutral-700'>"{testimonial.quote}"</p>
                <div>
                  <p className='text-sm font-semibold text-neutral-900'>{testimonial.name}</p>
                  <p className='text-xs text-neutral-500'>{testimonial.role}</p>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className='mx-auto max-w-6xl px-6'>
        <Card variant='glass' className='grid items-center gap-8 border border-white/60 bg-mesh p-8 md:grid-cols-[1.2fr_0.8fr]'>
          <div className='space-y-3'>
            <p className='text-sm font-semibold text-primary'>جاهز للانطلاق؟</p>
            <p className='text-2xl font-bold text-neutral-900'>
              ابدأ رحلتك التدريبية مع محتوى متخصص يرفع جاهزيتك المهنية.
            </p>
            <p className='text-sm text-neutral-600'>تواصل معنا أو اختر الدورة المناسبة الآن.</p>
            <Button asChild>
              <Link href='/contact'>تواصل معنا</Link>
            </Button>
          </div>
          <div className='relative h-56 w-full'>
            <MedicalIllustration id='consultationScene' />
          </div>
        </Card>
      </section>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }} />
    </div>
  )
}
