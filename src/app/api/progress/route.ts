import { NextResponse } from 'next/server'
import { z } from 'zod'
import crypto from 'crypto'
import { prisma } from '@/lib/db/prisma'
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

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.id, courseId: parsed.data.courseId } }
  })

  if (!enrollment) {
    return NextResponse.json({ message: 'التسجيل غير موجود.' }, { status: 404 })
  }

  const progress = Math.min(100, Math.max(0, parsed.data.progressPercent))
  const shouldComplete = progress >= 100

  const updated = await prisma.enrollment.update({
    where: { id: enrollment.id },
    data: {
      progressPercent: progress,
      status: shouldComplete ? 'COMPLETED' : 'ACTIVE',
      certificateId: shouldComplete ? enrollment.certificateId ?? crypto.randomUUID() : enrollment.certificateId,
      certificateUrl: shouldComplete
        ? enrollment.certificateUrl ?? `/api/certificates/${parsed.data.courseId}`
        : enrollment.certificateUrl
    }
  })

  return NextResponse.json({ enrollment: updated })
}
