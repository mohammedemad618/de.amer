import { NextRequest, NextResponse } from 'next/server'
import { sql, getFirst } from '@/lib/db/neon'

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const results = await sql`
    SELECT * FROM courses 
    WHERE id = ${id}
    LIMIT 1
  `
  const course = getFirst(results)
  if (!course) {
    return NextResponse.json({ message: 'الدورة غير موجودة.' }, { status: 404 })
  }
  return NextResponse.json({ course })
}
