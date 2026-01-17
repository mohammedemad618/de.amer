import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/guards'
import { sql } from '@/lib/db/neon'
import { CoursesAdminClient } from '@/components/admin/courses-admin-client'

export const dynamic = 'force-dynamic'

export default async function AdminCoursesPage() {
  try {
    await requireAdmin()
  } catch {
    redirect('/auth/login')
  }

  const coursesResults = await sql`
    SELECT 
      c.*,
      COALESCE(
        json_agg(
          json_build_object(
            'id', e.id,
            'status', e.status,
            'progressPercent', e."progressPercent"
          )
        ) FILTER (WHERE e.id IS NOT NULL),
        '[]'::json
      ) as enrollments
    FROM courses c
    LEFT JOIN enrollments e ON c.id = e."courseId"
    GROUP BY c.id
    ORDER BY c."createdAt" DESC
  `
  const courses = coursesResults as any[]

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
            <h1 className='text-3xl font-bold text-neutral-900 md:text-4xl'>إدارة الدورات</h1>
            <p className='text-lg text-neutral-600'>قم بإضافة وتعديل وحذف الدورات التعليمية.</p>
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-6'>
        <CoursesAdminClient courses={courses} />
      </section>
    </div>
  )
}
