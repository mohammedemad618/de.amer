import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { sql, getFirst } from '@/lib/db/neon'
import { getSessionUser } from '@/lib/auth/guards'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SectionHeading } from '@/components/ui/section-heading'
import { EnrollButton } from '@/components/courses/enroll-button'
import { MedicalIllustration } from '@/components/illustrations/medical-illustration'
import { Reveal } from '@/components/ui/reveal'
import { Stagger, StaggerItem } from '@/components/ui/stagger'
import { getSetting, formatPrice, type CurrencyCode } from '@/lib/settings'

export const dynamic = 'force-dynamic'

const levelLabels = {
  BEGINNER: 'مبتدئ',
  INTERMEDIATE: 'متوسط',
  ADVANCED: 'متقدم'
} as const

const levelBadges = {
  BEGINNER: 'success',
  INTERMEDIATE: 'warning',
  ADVANCED: 'error'
} as const

const highlights = [
  {
    title: 'تطبيقات واقعية',
    desc: 'نحوّل المفاهيم إلى خطوات عملية يمكنك تطبيقها مباشرة مع الحالات اليومية.'
  },
  {
    title: 'أدلة مختصرة',
    desc: 'ملخصات بصرية وأطر عمل تساعدك على المراجعة السريعة بثقة.'
  },
  {
    title: 'متابعة مرنة',
    desc: 'تستطيع إعادة الدروس متى شئت مع توجيهات واضحة لكل مرحلة.'
  }
]

const steps = [
  {
    step: '01',
    title: 'ابدأ بالمقدمة',
    desc: 'تعرف على المفاهيم الأساسية وخريطة الدورة قبل الدخول في التفاصيل.'
  },
  {
    step: '02',
    title: 'نفذ مهامك',
    desc: 'طبّق الأدوات على أمثلة عملية واستفد من الملفات المرفقة.'
  },
  {
    step: '03',
    title: 'قِس تقدمك',
    desc: 'راجع النتائج وحدد نقاط التحسين حتى تصل إلى الجاهزية الكاملة.'
  }
]

function parseObjectives(value: string) {
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : []
  } catch {
    return []
  }
}

export default async function CourseDetailsPage({ params }: { params: { id: string } }) {
  const [session, courseResults, defaultCurrency] = await Promise.all([
    getSessionUser(),
    sql`SELECT * FROM courses WHERE id = ${params.id} LIMIT 1`,
    getSetting('default_currency', 'USD') as Promise<string>
  ])

  const course = getFirst(courseResults as any[])
  if (!course) {
    notFound()
  }

  // التحقق من أن المستخدم مسجل في الدورة
  let enrollment = null
  if (session) {
    const enrollmentResults = await sql`
      SELECT * FROM enrollments 
      WHERE "userId" = ${session.id} AND "courseId" = ${course.id}
      LIMIT 1
    `
    enrollment = getFirst(enrollmentResults as any[])
  }

  const currency = (defaultCurrency === 'USD' || defaultCurrency === 'SYP' || defaultCurrency === 'EUR'
    ? defaultCurrency
    : 'USD') as CurrencyCode

  const objectives = parseObjectives(course.objectives)
  const priceLabel = formatPrice(course.price, currency)
  const levelLabel = levelLabels[course.level as keyof typeof levelLabels] ?? 'متوسط'
  const levelVariant = levelBadges[course.level as keyof typeof levelBadges] ?? 'neutral'
  const isEnrolled = enrollment !== null
  const hasMeetingLink = course.meetingLink && course.meetingLink.trim() !== ''

  return (
    <div className='space-y-16 pb-16'>
      <section className='relative overflow-hidden bg-hero-gradient'>
        <div
          className='pointer-events-none absolute -left-24 top-12 h-40 w-40 rounded-full bg-accent-turquoise/25 blur-3xl'
          aria-hidden='true'
        />
        <div
          className='pointer-events-none absolute -right-32 bottom-0 h-56 w-56 rounded-full bg-accent-purple/25 blur-3xl'
          aria-hidden='true'
        />
        <div className='mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.2fr_0.8fr]'>
          <Reveal className='space-y-6'>
            <nav className='text-sm text-neutral-600' aria-label='مسار التنقل'>
              <Link href='/courses' className='font-semibold text-primary hover:underline'>
                الدورات
              </Link>{' '}
              / <span className='text-neutral-900'>{course.title}</span>
            </nav>
            <div className='space-y-4'>
              <h1 className='text-3xl font-bold leading-tight text-neutral-900 md:text-5xl'>{course.title}</h1>
              <p className='text-lg text-neutral-600'>{course.description}</p>
            </div>
            <div className='flex flex-wrap gap-2'>
              <Badge variant='info'>{course.category}</Badge>
              <Badge variant={levelVariant}>{levelLabel}</Badge>
              <Badge variant='success'>{priceLabel}</Badge>
              <Badge variant='neutral'>{course.hours} ساعة تدريبية</Badge>
            </div>
            <div className='flex flex-wrap gap-3'>
              <Button asChild>
                <Link href='/contact'>استشرنا قبل الانضمام</Link>
              </Button>
              <Button asChild variant='outline'>
                <Link href='/courses'>عودة لكل الدورات</Link>
              </Button>
            </div>
          </Reveal>
          <Reveal className='space-y-4' delay={0.15}>
            <Card variant='glass' className='space-y-5 bg-mesh'>
              <div className='relative h-44 w-full overflow-hidden rounded-xl bg-neutral-100'>
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  sizes='(max-width: 768px) 100vw, 40vw'
                  className='object-cover'
                  priority
                />
              </div>
              <div className='flex items-center justify-between'>
                <p className='text-sm font-semibold text-neutral-700'>سعر الدورة</p>
                <p className='text-2xl font-bold text-primary'>{priceLabel}</p>
              </div>
              <div className='grid gap-2 text-sm text-neutral-600'>
                <div className='flex items-center justify-between'>
                  <span>المستوى</span>
                  <span className='font-semibold text-neutral-800'>{levelLabel}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span>المدة</span>
                  <span className='font-semibold text-neutral-800'>{course.hours} ساعة</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span>الوصول</span>
                  <span className='font-semibold text-neutral-800'>محتوى مرن</span>
                </div>
              </div>
              {session ? (
                <div className='space-y-2'>
                  {isEnrolled ? (
                    <>
                      <Button asChild variant='success'>
                        <span>✓ مسجل في الدورة</span>
                      </Button>
                      {hasMeetingLink && (
                        <Button asChild variant='secondary' className='w-full'>
                          <a href={course.meetingLink!} target='_blank' rel='noopener noreferrer'>
                            🎥 انضم إلى الاجتماع
                          </a>
                        </Button>
                      )}
                    </>
                  ) : (
                    <EnrollButton courseId={course.id} />
                  )}
                </div>
              ) : (
                <div className='space-y-2'>
                  <Button asChild>
                    <Link href='/auth/login'>سجل للانضمام</Link>
                  </Button>
                  <p className='text-xs text-neutral-500'>سجل دخولك أولاً لنكمل عملية التسجيل.</p>
                </div>
              )}
            </Card>
          </Reveal>
        </div>
      </section>

      <section className='mx-auto max-w-6xl space-y-8 px-6'>
        <SectionHeading title='ماذا ستتعلم في هذه الدورة؟' subtitle='أهداف واضحة ونقاط تركيز تساعدك على بناء مهارات عملية.' />
        {objectives.length === 0 ? (
          <Card variant='bordered' className='text-sm text-neutral-600'>
            سيتم إضافة أهداف الدورة قريباً.
          </Card>
        ) : (
          <Stagger className='grid gap-4 md:grid-cols-2'>
            {objectives.map((objective, index) => (
              <StaggerItem key={objective}>
                <Card variant='bordered' className='flex h-full items-start gap-4'>
                  <span className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary'>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className='text-sm text-neutral-700'>{objective}</p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </section>

      <section className='mx-auto max-w-6xl space-y-8 px-6'>
        <SectionHeading title='لماذا هذه الدورة؟' subtitle='تصميم تعليمي يوازن بين المعرفة النظرية والتطبيق العملي.' />
        <div className='grid gap-6 md:grid-cols-3'>
          {highlights.map((item) => (
            <Card key={item.title} variant='elevated' className='space-y-3'>
              <p className='text-sm font-semibold text-primary'>{item.title}</p>
              <p className='text-sm text-neutral-600'>{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className='mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-[0.9fr_1.1fr]'>
        <Reveal className='relative h-64 w-full'>
          <MedicalIllustration id='consultationScene' />
        </Reveal>
        <Reveal className='space-y-6' delay={0.1}>
          <SectionHeading title='خطة التعلّم خطوة بخطوة' subtitle='اتبع المسار الواضح لتصل إلى نتائج ملموسة بثقة.' />
          <div className='grid gap-4'>
            {steps.map((item) => (
              <Card key={item.step} variant='bordered' className='space-y-2'>
                <p className='text-xs font-semibold text-primary'>{item.step}</p>
                <p className='text-base font-semibold text-neutral-900'>{item.title}</p>
                <p className='text-sm text-neutral-600'>{item.desc}</p>
              </Card>
            ))}
          </div>
        </Reveal>
      </section>

      <section className='mx-auto max-w-6xl px-6'>
        <Card
          variant='glass'
          className='grid items-center gap-8 border border-white/70 bg-mesh p-8 md:grid-cols-[1.1fr_0.9fr]'
        >
          <div className='space-y-3'>
            <p className='text-sm font-semibold text-primary'>جاهز للانطلاق؟</p>
            <p className='text-2xl font-bold text-neutral-900'>
              ابدأ رحلة التعلم مع محتوى متخصص يساعدك على بناء خبرة متقدمة.
            </p>
            <p className='text-sm text-neutral-600'>انضم الآن أو تواصل معنا لأي استفسار قبل التسجيل.</p>
            <div className='flex flex-wrap gap-3'>
              {session ? (
                <>
                  {isEnrolled ? (
                    <>
                      <Button asChild variant='success'>
                        <span>✓ مسجل في الدورة</span>
                      </Button>
                      {hasMeetingLink && (
                        <Button asChild variant='secondary'>
                          <a href={course.meetingLink!} target='_blank' rel='noopener noreferrer'>
                            🎥 انضم إلى الاجتماع
                          </a>
                        </Button>
                      )}
                    </>
                  ) : (
                    <EnrollButton courseId={course.id} />
                  )}
                </>
              ) : (
                <Button asChild>
                  <Link href='/auth/register'>إنشاء حساب جديد</Link>
                </Button>
              )}
              <Button asChild variant='outline'>
                <Link href='/contact'>تواصل معنا</Link>
              </Button>
            </div>
          </div>
          <div className='relative h-52 w-full'>
            <MedicalIllustration id='doctorClipboard' />
          </div>
        </Card>
      </section>
    </div>
  )
}
