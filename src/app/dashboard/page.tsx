import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth/guards'
import { sql, getFirst } from '@/lib/db/neon'
import { Card } from '@/components/ui/card'
import { StatCard } from '@/components/dashboard/stat-card'
import { CourseTable } from '@/components/dashboard/course-table'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { ProgressTimeline } from '@/components/dashboard/progress-timeline'
import { CertificateCard } from '@/components/dashboard/certificate-card'
import { LogoutButton } from '@/components/auth/logout-button'
import { Reveal } from '@/components/ui/reveal'
import { Stagger, StaggerItem } from '@/components/ui/stagger'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  // #region agent log
  console.log('[DEBUG] DashboardPage: Starting, calling getSessionUser');
  // #endregion
  const session = await getSessionUser()
  // #region agent log
  console.log('[DEBUG] DashboardPage: getSessionUser result', { hasSession: !!session, sessionId: session?.id?.substring(0, 8) });
  // #endregion
  if (!session) {
    // #region agent log
    console.log('[DEBUG] DashboardPage: No session, redirecting to login');
    // #endregion
    redirect('/auth/login')
  }

  // توجيه المسؤولين إلى لوحة تحكم المسؤول
  if (session.role === 'ADMIN') {
    redirect('/admin/dashboard')
  }

  const userResults = await sql`
    SELECT * FROM users 
    WHERE id = ${session.id}
    LIMIT 1
  `
  const user = getFirst(userResults as any[])

  if (!user) {
    redirect('/auth/login')
  }

  // جلب التسجيلات مع الدورات
  const enrollmentsResults = await sql`
    SELECT 
      e.*,
      json_build_object(
        'id', c.id,
        'title', c.title,
        'category', c.category,
        'description', c.description,
        'hours', c.hours,
        'price', c.price,
        'level', c.level,
        'thumbnail', c.thumbnail,
        'meetingLink', c."meetingLink"
      ) as course
    FROM enrollments e
    JOIN courses c ON e."courseId" = c.id
    WHERE e."userId" = ${session.id}
    ORDER BY e."updatedAt" DESC
  `
  
  const enrollments = (enrollmentsResults as any[]).map((e: any) => ({
    ...e,
    course: e.course
  }))

  if (!user) {
    redirect('/auth/login')
  }

  const totalEnrollments = enrollments.length
  const completedEnrollments = enrollments.filter((e: any) => e.status === 'COMPLETED').length
  const activeEnrollments = Math.max(totalEnrollments - completedEnrollments, 0)
  const averageProgress = totalEnrollments
    ? Math.round(enrollments.reduce((sum: number, e: any) => sum + (e.progressPercent || 0), 0) / totalEnrollments)
    : 0

  // Prepare timeline events
  const timelineEvents = [
    ...enrollments.map((enrollment: any) => ({
      id: `enrollment-${enrollment.id}`,
      title: 'تسجيل في دورة جديدة',
      description: `تم التسجيل في دورة "${enrollment.course?.title || ''}"`,
      date: enrollment.createdAt,
      type: 'enrollment' as const,
      courseTitle: enrollment.course?.title || ''
    })),
    ...enrollments
      .filter((e: any) => e.progressPercent > 0 && e.progressPercent < 100)
      .map((enrollment: any) => ({
        id: `progress-${enrollment.id}`,
        title: 'تقدم في الدورة',
        description: `وصلت إلى ${enrollment.progressPercent}% في "${enrollment.course?.title || ''}"`,
        date: enrollment.updatedAt,
        type: 'progress' as const,
        courseTitle: enrollment.course?.title || ''
      })),
    ...enrollments
      .filter((e: any) => e.status === 'COMPLETED')
      .map((enrollment: any) => ({
        id: `completion-${enrollment.id}`,
        title: 'إتمام دورة',
        description: `أكملت دورة "${enrollment.course?.title || ''}" بنجاح!`,
        date: enrollment.updatedAt,
        type: 'completion' as const,
        courseTitle: enrollment.course?.title || ''
      })),
    ...enrollments
      .filter((e: any) => e.certificateId)
      .map((enrollment: any) => ({
        id: `certificate-${enrollment.id}`,
        title: 'حصول على شهادة',
        description: `حصلت على شهادة إتمام "${enrollment.course?.title || ''}"`,
        date: enrollment.updatedAt,
        type: 'certificate' as const,
        courseTitle: enrollment.course?.title || ''
      }))
  ]

  const certificates = enrollments
    .filter((enrollment: any) => enrollment.certificateId && enrollment.certificateUrl)
    .map((enrollment: any) => ({
      courseTitle: enrollment.course?.title || '',
      certificateId: enrollment.certificateId ?? '',
      certificateUrl: enrollment.certificateUrl ?? '',
      completedAt: enrollment.updatedAt
    }))

  return (
    <div className='space-y-8 pb-16'>
      {/* Header Section */}
      <section className='relative overflow-hidden bg-hero-gradient'>
        <div
          className='pointer-events-none absolute -left-24 top-10 h-40 w-40 rounded-full bg-accent-purple/20 blur-3xl'
          aria-hidden='true'
        />
        <div
          className='pointer-events-none absolute -right-32 bottom-0 h-56 w-56 rounded-full bg-accent-turquoise/25 blur-3xl'
          aria-hidden='true'
        />
        <div className='mx-auto max-w-7xl space-y-6 px-6 py-12'>
          <Reveal className='flex items-center justify-between gap-4'>
            <div className='space-y-2'>
              <p className='text-sm font-semibold text-primary'>لوحة التحكم</p>
              <h1 className='text-3xl font-bold text-neutral-900 md:text-4xl'>مرحباً {user.name} 👋</h1>
              <p className='text-lg text-neutral-600'>تابع مسارك وواصل رحلتك التدريبية بخطوات واضحة.</p>
            </div>
            <div className='shrink-0'>
              <LogoutButton showError />
            </div>
          </Reveal>

          {/* Stats Grid */}
          <Stagger className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <StaggerItem>
              <StatCard
                label='الدورات المسجلة'
                value={totalEnrollments}
                accent='primary'
                icon={
                  <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                  </svg>
                }
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                label='الدورات النشطة'
                value={activeEnrollments}
                accent='info'
                icon={
                  <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                  </svg>
                }
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                label='الدورات المكتملة'
                value={completedEnrollments}
                accent='success'
                icon={
                  <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                }
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                label='متوسط التقدم'
                value={`${averageProgress}%`}
                accent='warning'
                icon={
                  <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' />
                  </svg>
                }
              />
            </StaggerItem>
          </Stagger>

          {/* User Profile Card */}
          <Card variant='glass' className='flex flex-wrap items-center justify-between gap-4 p-4'>
            <div className='space-y-1'>
              <p className='text-sm font-semibold text-neutral-800'>ملفك الشخصي</p>
              <div className='flex flex-wrap gap-4 text-sm text-neutral-600'>
                <span>الاسم: {user.name}</span>
                <span>البريد: {user.email}</span>
              </div>
            </div>
            <div className='flex flex-wrap items-center gap-2 text-xs'>
              <span className='rounded-full bg-white/80 px-3 py-1.5 font-semibold text-neutral-700'>
                {totalEnrollments} دورة
              </span>
              <span className='rounded-full bg-white/80 px-3 py-1.5 font-semibold text-neutral-700'>
                {completedEnrollments} مكتملة
              </span>
            </div>
          </Card>
        </div>
      </section>

      {/* Quick Actions */}
      <section className='mx-auto max-w-7xl px-6'>
        <QuickActions />
      </section>

      {/* Courses Table */}
      <section className='mx-auto max-w-7xl space-y-4 px-6'>
        <div className='space-y-1'>
          <h2 className='text-2xl font-bold text-neutral-900'>الدورات المسجلة</h2>
          <p className='text-sm text-neutral-600'>تابع تقدمك وأكمل الدروس المعلقة.</p>
        </div>
        {user.enrollments.length === 0 ? (
          <Card variant='bordered' className='p-8 text-center'>
            <p className='text-sm text-neutral-500'>لا توجد دورات مسجلة حالياً.</p>
          </Card>
        ) : (
          <CourseTable enrollments={enrollments} />
        )}
      </section>

      {/* Certificates */}
      {certificates.length > 0 && (
        <section className='mx-auto max-w-7xl space-y-4 px-6'>
          <div className='space-y-1'>
            <h2 className='text-2xl font-bold text-neutral-900'>الشهادات</h2>
            <p className='text-sm text-neutral-600'>الشهادات المتاحة بعد الوصول إلى 100%.</p>
          </div>
          <Stagger className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {certificates.map((certificate) => (
              <StaggerItem key={certificate.certificateId}>
                <CertificateCard certificate={certificate} />
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {/* Progress Timeline */}
      {timelineEvents.length > 0 && (
        <section className='mx-auto max-w-7xl space-y-4 px-6'>
          <div className='space-y-1'>
            <h2 className='text-2xl font-bold text-neutral-900'>سجل التقدم</h2>
            <p className='text-sm text-neutral-600'>آخر الأنشطة والإنجازات في رحلتك التعليمية.</p>
          </div>
          <ProgressTimeline events={timelineEvents.slice(0, 10)} />
        </section>
      )}
    </div>
  )
}
