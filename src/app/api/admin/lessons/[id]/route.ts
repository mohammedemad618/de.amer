import { NextResponse } from 'next/server'
import { z } from 'zod'
import { sql, getFirst } from '@/lib/db/neon'
import { requireAdmin } from '@/lib/auth/guards'
import { verifyCsrf } from '@/lib/security/csrf'

const lessonSchema = z.object({
  title: z.string().min(1, 'عنوان الدرس مطلوب').optional(),
  description: z.string().min(1, 'وصف الدرس مطلوب').optional(),
  content: z.string().min(1, 'محتوى الدرس مطلوب').optional(),
  order: z.number().int().positive('ترتيب الدرس يجب أن يكون رقماً موجباً').optional(),
  duration: z.number().int().positive('مدة الدرس يجب أن تكون رقماً موجباً').optional().nullable(),
  videoUrl: z.string().url('رابط الفيديو يجب أن يكون رابطاً صالحاً').optional().or(z.literal('')).nullable(),
  resources: z.string().optional().nullable()
})

// PUT: تحديث درس
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
    const parsed = lessonSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'بيانات غير صالحة', errors: parsed.error.errors },
        { status: 400 }
      )
    }

    const data = parsed.data
    const now = new Date()
    
    // التحقق من وجود الدرس أولاً
    const existingResults = await sql`
      SELECT * FROM lessons 
      WHERE id = ${id}
      LIMIT 1
    `
    const existing = getFirst(existingResults)
    
    if (!existing) {
      return NextResponse.json({ message: 'الدرس غير موجود.' }, { status: 404 })
    }
    
    // بناء SQL UPDATE ديناميكياً باستخدام template literals
    let updateQuery = sql`UPDATE lessons SET `
    
    if (data.title) {
      updateQuery = sql`${updateQuery} title = ${data.title}, `
    }
    if (data.description) {
      updateQuery = sql`${updateQuery} description = ${data.description}, `
    }
    if (data.content) {
      updateQuery = sql`${updateQuery} content = ${data.content}, `
    }
    if (data.order !== undefined) {
      updateQuery = sql`${updateQuery} "order" = ${data.order}, `
    }
    if (data.duration !== undefined) {
      updateQuery = sql`${updateQuery} duration = ${data.duration}, `
    }
    if (data.videoUrl !== undefined) {
      updateQuery = sql`${updateQuery} "videoUrl" = ${data.videoUrl || null}, `
    }
    if (data.resources !== undefined) {
      updateQuery = sql`${updateQuery} resources = ${data.resources || null}, `
    }
    
    updateQuery = sql`${updateQuery} "updatedAt" = ${now} WHERE id = ${id} RETURNING *`
    
    const lessonResults = await updateQuery
    const lesson = getFirst(lessonResults)

    return NextResponse.json({ lesson, message: 'تم تحديث الدرس بنجاح.' })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ message: 'غير مصرح لك بالوصول إلى هذه الصفحة.' }, { status: 403 })
    }
    // يتم التحقق من وجود الدرس قبل التحديث
    console.error('خطأ في تحديث الدرس:', error)
    return NextResponse.json({ message: 'حدث خطأ أثناء تحديث الدرس.' }, { status: 500 })
  }
}

// DELETE: حذف درس
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
      DELETE FROM lessons 
      WHERE id = ${id}
    `

    return NextResponse.json({ message: 'تم حذف الدرس بنجاح.' })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ message: 'غير مصرح لك بالوصول إلى هذه الصفحة.' }, { status: 403 })
    }
    // في SQL، إذا لم يتم حذف أي صف، لا يوجد خطأ
    console.error('خطأ في حذف الدرس:', error)
    return NextResponse.json({ message: 'حدث خطأ أثناء حذف الدرس.' }, { status: 500 })
  }
}
