import { NextResponse } from 'next/server'
import { z } from 'zod'
import { sql, getFirst } from '@/lib/db/neon'
import { getSessionUser } from '@/lib/auth/guards'
import { verifyCsrf } from '@/lib/security/csrf'

const schema = z.object({
  courseId: z.string().min(1)
})

export async function POST(request: Request) {
  const session = await getSessionUser()
  if (!session) {
    return NextResponse.json({ message: 'غير مصرح.' }, { status: 401 })
  }

  if (!(await verifyCsrf(request))) {
    return NextResponse.json({ message: 'رمز الحماية غير صالح.' }, { status: 403 })
  }

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ message: 'بيانات غير صالحة.' }, { status: 400 })
  }

  const courseResults = await sql`
    SELECT * FROM courses 
    WHERE id = ${parsed.data.courseId}
    LIMIT 1
  `
  const course = getFirst(courseResults)
  if (!course) {
    return NextResponse.json({ message: 'الدورة غير موجودة.' }, { status: 404 })
  }

  const existingResults = await sql`
    SELECT * FROM enrollments 
    WHERE "userId" = ${session.id} AND "courseId" = ${parsed.data.courseId}
    LIMIT 1
  `
  const existing = getFirst(existingResults)

  if (existing) {
    return NextResponse.json({ enrollment: existing })
  }

  const now = new Date()
  const enrollmentResults = await sql`
    INSERT INTO enrollments (id, "userId", "courseId", status, "progressPercent", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), ${session.id}, ${parsed.data.courseId}, 'ACTIVE', 0, ${now}, ${now})
    RETURNING *
  `
  const enrollment = getFirst(enrollmentResults)

  return NextResponse.json({ enrollment })
}
