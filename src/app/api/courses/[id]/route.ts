import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const course = await prisma.course.findUnique({ where: { id } })
  if (!course) {
    return NextResponse.json({ message: 'الدورة غير موجودة.' }, { status: 404 })
  }
  return NextResponse.json({ course })
}
