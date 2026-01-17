import { NextResponse } from 'next/server'
import { z } from 'zod'
import { sql, getFirst } from '@/lib/db/neon'
import { requireAdmin } from '@/lib/auth/guards'
import { verifyCsrf } from '@/lib/security/csrf'

const courseSchema = z.object({
  title: z.string().min(1, 'العنوان مطلوب').optional(),
  category: z.string().min(1, 'الفئة مطلوبة').optional(),
  description: z.string().min(1, 'الوصف مطلوب').optional(),
  objectives: z.string().min(1, 'الأهداف مطلوبة').optional(),
  hours: z.number().int().positive('عدد الساعات يجب أن يكون رقماً موجباً').optional(),
  price: z.number().min(0, 'السعر يجب أن يكون رقماً موجباً أو صفر').optional(),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
  thumbnail: z.string().url('رابط الصورة يجب أن يكون رابطاً صالحاً').optional(),
  meetingLink: z.string().url('رابط الاجتماع يجب أن يكون رابطاً صالحاً').optional().or(z.literal(''))
})

// PUT: تحديث دورة
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()

    const csrfValid = await verifyCsrf(request)
    if (!csrfValid) {
      return NextResponse.json(
        { message: 'رمز الحماية غير صالح. يرجى تحديث الصفحة والمحاولة مرة أخرى.' },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const parsed = courseSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'بيانات غير صالحة', errors: parsed.error.errors },
        { status: 400 }
      )
    }

    const data = parsed.data
    const now = new Date()
    
    // التحقق من وجود الدورة أولاً
    const existingResults = await sql`
      SELECT * FROM courses 
      WHERE id = ${id}
      LIMIT 1
    `
    const existing = getFirst(existingResults as any[])
    
    if (!existing) {
      return NextResponse.json({ message: 'الدورة غير موجودة.' }, { status: 404 })
    }
    
    // بناء SQL UPDATE ديناميكياً باستخدام template literals
    let updateQuery = sql`UPDATE courses SET `
    const updates: string[] = []
    
    if (data.title) {
      updateQuery = sql`${updateQuery} title = ${data.title}, `
    }
    if (data.category) {
      updateQuery = sql`${updateQuery} category = ${data.category}, `
    }
    if (data.description) {
      updateQuery = sql`${updateQuery} description = ${data.description}, `
    }
    if (data.objectives) {
      updateQuery = sql`${updateQuery} objectives = ${data.objectives}, `
    }
    if (data.hours !== undefined) {
      updateQuery = sql`${updateQuery} hours = ${data.hours}, `
    }
    if (data.price !== undefined) {
      updateQuery = sql`${updateQuery} price = ${data.price}, `
    }
    if (data.level) {
      updateQuery = sql`${updateQuery} level = ${data.level}, `
    }
    if (data.thumbnail) {
      updateQuery = sql`${updateQuery} thumbnail = ${data.thumbnail}, `
    }
    if (data.meetingLink !== undefined) {
      updateQuery = sql`${updateQuery} "meetingLink" = ${data.meetingLink || null}, `
    }
    
    updateQuery = sql`${updateQuery} "updatedAt" = ${now} WHERE id = ${id} RETURNING *`
    
    const courseResults = await updateQuery
    const course = getFirst(courseResults)

    return NextResponse.json({ course, message: 'تم تحديث الدورة بنجاح.' })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ message: 'غير مصرح لك بالوصول إلى هذه الصفحة.' }, { status: 403 })
    }
    // يتم التحقق من وجود الدورة قبل التحديث
    console.error('خطأ في تحديث الدورة:', error)
    return NextResponse.json({ message: 'حدث خطأ أثناء تحديث الدورة.' }, { status: 500 })
  }
}

// DELETE: حذف دورة
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()

    const csrfValid = await verifyCsrf(request)
    if (!csrfValid) {
      return NextResponse.json(
        { message: 'رمز الحماية غير صالح. يرجى تحديث الصفحة والمحاولة مرة أخرى.' },
        { status: 403 }
      )
    }

    const { id } = await params
    await sql`
      DELETE FROM courses 
      WHERE id = ${id}
    `

    return NextResponse.json({ message: 'تم حذف الدورة بنجاح.' })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ message: 'غير مصرح لك بالوصول إلى هذه الصفحة.' }, { status: 403 })
    }
    // في SQL، إذا لم يتم حذف أي صف، لا يوجد خطأ
    console.error('خطأ في حذف الدورة:', error)
    return NextResponse.json({ message: 'حدث خطأ أثناء حذف الدورة.' }, { status: 500 })
  }
}
