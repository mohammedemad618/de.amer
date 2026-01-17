import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db/prisma'
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
    const course = await prisma.course.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.category && { category: data.category }),
        ...(data.description && { description: data.description }),
        ...(data.objectives && { objectives: data.objectives }),
        ...(data.hours !== undefined && { hours: data.hours }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.level && { level: data.level }),
        ...(data.thumbnail && { thumbnail: data.thumbnail }),
        ...(data.meetingLink !== undefined && { meetingLink: data.meetingLink || null })
      }
    })

    return NextResponse.json({ course, message: 'تم تحديث الدورة بنجاح.' })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ message: 'غير مصرح لك بالوصول إلى هذه الصفحة.' }, { status: 403 })
    }
    if (error instanceof Error && error.message.includes('Record to update does not exist')) {
      return NextResponse.json({ message: 'الدورة غير موجودة.' }, { status: 404 })
    }
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
    await prisma.course.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'تم حذف الدورة بنجاح.' })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ message: 'غير مصرح لك بالوصول إلى هذه الصفحة.' }, { status: 403 })
    }
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json({ message: 'الدورة غير موجودة.' }, { status: 404 })
    }
    console.error('خطأ في حذف الدورة:', error)
    return NextResponse.json({ message: 'حدث خطأ أثناء حذف الدورة.' }, { status: 500 })
  }
}
