import { NextResponse } from 'next/server'
import { z } from 'zod'
import crypto from 'crypto'
import { sql, getFirst } from '@/lib/db/neon'
import { getSessionUser } from '@/lib/auth/guards'
import { verifyCsrf } from '@/lib/security/csrf'

const schema = z.object({
  courseId: z.string().min(1),
  progressPercent: z.coerce.number().min(0).max(100)
})

export async function PATCH(request: Request) {
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

  const enrollmentResults = await sql`
    SELECT * FROM enrollments 
    WHERE "userId" = ${session.id} AND "courseId" = ${parsed.data.courseId}
    LIMIT 1
  `
  const enrollment = getFirst(enrollmentResults)

  if (!enrollment) {
    return NextResponse.json({ message: 'التسجيل غير موجود.' }, { status: 404 })
  }

  const progress = Math.min(100, Math.max(0, parsed.data.progressPercent))
  const shouldComplete = progress >= 100
  const certificateId = shouldComplete ? (enrollment.certificateId ?? crypto.randomUUID()) : enrollment.certificateId
  const certificateUrl = shouldComplete
    ? (enrollment.certificateUrl ?? `/api/certificates/${parsed.data.courseId}`)
    : enrollment.certificateUrl

  const updatedResults = await sql`
    UPDATE enrollments 
    SET "progressPercent" = ${progress},
        status = ${shouldComplete ? 'COMPLETED' : 'ACTIVE'},
        "certificateId" = ${certificateId},
        "certificateUrl" = ${certificateUrl},
        "updatedAt" = ${new Date()}
    WHERE id = ${enrollment.id}
    RETURNING *
  `
  const updated = getFirst(updatedResults)

  return NextResponse.json({ enrollment: updated })
}
