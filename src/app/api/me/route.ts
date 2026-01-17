import { NextResponse } from 'next/server'
import { sql, getFirst } from '@/lib/db/neon'
import { getSessionUser } from '@/lib/auth/guards'

export async function GET() {
  const session = await getSessionUser()
  if (!session) {
    return NextResponse.json({ message: 'غير مصرح.' }, { status: 401 })
  }

  // جلب المستخدم
  const userResults = await sql`
    SELECT * FROM users 
    WHERE id = ${session.id}
    LIMIT 1
  `
  const user = getFirst(userResults)

  if (!user) {
    return NextResponse.json({ message: 'غير مصرح.' }, { status: 401 })
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
        'thumbnail', c.thumbnail
      ) as course
    FROM enrollments e
    JOIN courses c ON e."courseId" = c.id
    WHERE e."userId" = ${session.id}
    ORDER BY e."createdAt" DESC
  `

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      enrollments: enrollmentsResults.map((e: any) => ({
        id: e.id,
        userId: e.userId,
        courseId: e.courseId,
        status: e.status,
        progressPercent: e.progressPercent,
        certificateId: e.certificateId,
        certificateUrl: e.certificateUrl,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
        course: e.course
      }))
    }
  })
}
