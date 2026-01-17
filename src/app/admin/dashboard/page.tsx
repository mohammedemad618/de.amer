import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/guards'
import { sql } from '@/lib/db/neon'
import { Card } from '@/components/ui/card'
import { StatCard } from '@/components/dashboard/stat-card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  try {
    await requireAdmin()
  } catch {
    redirect('/auth/login')
  }

  const [totalCoursesResult, totalUsersResult, totalEnrollmentsResult, recentCoursesResults] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM courses`,
    sql`SELECT COUNT(*) as count FROM users`,
    sql`SELECT COUNT(*) as count FROM enrollments`,
    sql`
      SELECT 
        c.*,
        COALESCE(
          json_agg(e.id) FILTER (WHERE e.id IS NOT NULL),
          '[]'::json
        ) as enrollments
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e."courseId"
      GROUP BY c.id
      ORDER BY c."createdAt" DESC
      LIMIT 5
    `
  ])

  const totalCourses = parseInt(String((totalCoursesResult as any)?.[0]?.count || '0'))
  const totalUsers = parseInt(String((totalUsersResult as any)?.[0]?.count || '0'))
  const totalEnrollments = parseInt(String((totalEnrollmentsResult as any)?.[0]?.count || '0'))
  const recentCourses = (Array.isArray(recentCoursesResults) ? recentCoursesResults : []).map((course: any) => ({
    ...course,
    enrollments: Array.isArray(course.enrollments) ? course.enrollments.map((id: string) => ({ id })) : []
  }))

  return (
    <div className='space-y-8 pb-16'>
      <section className='relative overflow-hidden bg-hero-gradient'>
        <div
          className='pointer-events-none absolute -left-24 top-10 h-40 w-40 rounded-full bg-accent-purple/20 blur-3xl'
          aria-hidden='true'
        />
        <div className='mx-auto max-w-7xl space-y-6 px-6 py-12'>
          <div className='space-y-2'>
            <p className='text-sm font-semibold text-primary'>لوحة تحكم المسؤول</p>
            <h1 className='text-3xl font-bold text-neutral-900 md:text-4xl'>مرحباً بك في لوحة التحكم 👋</h1>
            <p className='text-lg text-neutral-600'>إدارة الدورات والمستخدمين والتسجيلات.</p>
          </div>

          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <StatCard
              label='إجمالي الدورات'
              value={totalCourses}
              accent='primary'
              icon={
                <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                </svg>
              }
            />
            <StatCard
              label='إجمالي المستخدمين'
              value={totalUsers}
              accent='info'
              icon={
                <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' />
                </svg>
              }
            />
            <StatCard
              label='إجمالي التسجيلات'
              value={totalEnrollments}
              accent='success'
              icon={
                <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              }
            />
            <StatCard
              label='الدورات النشطة'
              value={recentCourses.length}
              accent='warning'
              icon={
                <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-7xl space-y-6 px-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-bold text-neutral-900'>الإجراءات السريعة</h2>
        </div>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <Card variant='elevated' className='p-6'>
            <h3 className='mb-2 text-lg font-bold text-neutral-900'>إدارة الدورات</h3>
            <p className='mb-4 text-sm text-neutral-600'>قم بإضافة وتعديل وحذف الدورات التعليمية.</p>
            <Button asChild>
              <Link href='/admin/courses'>إدارة الدورات</Link>
            </Button>
          </Card>
          <Card variant='elevated' className='p-6'>
            <h3 className='mb-2 text-lg font-bold text-neutral-900'>عرض الدورات</h3>
            <p className='mb-4 text-sm text-neutral-600'>استعرض جميع الدورات المتاحة في المنصة.</p>
            <Button asChild variant='outline'>
              <Link href='/courses'>عرض الدورات</Link>
            </Button>
          </Card>
          <Card variant='elevated' className='p-6'>
            <h3 className='mb-2 text-lg font-bold text-neutral-900'>إعدادات النظام</h3>
            <p className='mb-4 text-sm text-neutral-600'>قم بإدارة إعدادات النظام العامة.</p>
            <Button asChild variant='outline'>
              <Link href='/admin/settings'>الإعدادات</Link>
            </Button>
          </Card>
        </div>
      </section>

      <section className='mx-auto max-w-7xl space-y-6 px-6'>
        <h2 className='text-2xl font-bold text-neutral-900'>آخر الدورات المضافة</h2>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {recentCourses.map((course) => (
            <Card key={course.id} variant='bordered' className='p-6'>
              <h3 className='mb-2 text-lg font-bold text-neutral-900'>{course.title}</h3>
              <p className='mb-2 text-sm text-neutral-600'>{course.category}</p>
              <div className='flex items-center justify-between text-xs text-neutral-500'>
                <span>{course.enrollments.length} طالب</span>
                <span>{course.hours} ساعة</span>
              </div>
              <div className='mt-4 flex gap-2'>
                <Button asChild variant='outline' size='sm' className='flex-1'>
                  <Link href={`/courses/${course.id}`}>عرض</Link>
                </Button>
                <Button asChild variant='outline' size='sm' className='flex-1'>
                  <Link href={`/admin/courses`}>تعديل</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
        {recentCourses.length === 0 && (
          <Card variant='bordered' className='p-8 text-center'>
            <p className='text-sm text-neutral-500'>لا توجد دورات حالياً. ابدأ بإضافة دورة جديدة.</p>
          </Card>
        )}
      </section>
    </div>
  )
}
