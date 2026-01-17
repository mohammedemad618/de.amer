import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db/prisma'
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

  const course = await prisma.course.findUnique({ where: { id: parsed.data.courseId } })
  if (!course) {
    return NextResponse.json({ message: 'الدورة غير موجودة.' }, { status: 404 })
  }

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.id, courseId: course.id } }
  })

  if (existing) {
    return NextResponse.json({ enrollment: existing })
  }

  const enrollment = await prisma.enrollment.create({
    data: {
      userId: session.id,
      courseId: course.id,
      status: 'ACTIVE',
      progressPercent: 0
    }
  })

  return NextResponse.json({ enrollment })
}
