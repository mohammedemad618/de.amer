import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db/prisma'
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
    const lesson = await prisma.lesson.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.content && { content: data.content }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.duration !== undefined && { duration: data.duration }),
        ...(data.videoUrl !== undefined && { videoUrl: data.videoUrl || null }),
        ...(data.resources !== undefined && { resources: data.resources || null })
      }
    })

    return NextResponse.json({ lesson, message: 'تم تحديث الدرس بنجاح.' })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ message: 'غير مصرح لك بالوصول إلى هذه الصفحة.' }, { status: 403 })
    }
    if (error instanceof Error && error.message.includes('Record to update does not exist')) {
      return NextResponse.json({ message: 'الدرس غير موجود.' }, { status: 404 })
    }
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
    await prisma.lesson.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'تم حذف الدرس بنجاح.' })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ message: 'غير مصرح لك بالوصول إلى هذه الصفحة.' }, { status: 403 })
    }
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json({ message: 'الدرس غير موجود.' }, { status: 404 })
    }
    console.error('خطأ في حذف الدرس:', error)
    return NextResponse.json({ message: 'حدث خطأ أثناء حذف الدرس.' }, { status: 500 })
  }
}
