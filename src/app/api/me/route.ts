import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getSessionUser } from '@/lib/auth/guards'

export async function GET() {
  const session = await getSessionUser()
  if (!session) {
    return NextResponse.json({ message: 'غير مصرح.' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      enrollments: {
        include: { course: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!user) {
    return NextResponse.json({ message: 'غير مصرح.' }, { status: 401 })
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      enrollments: user.enrollments
    }
  })
}
