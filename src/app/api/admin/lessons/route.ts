import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db/prisma'
import { requireAdmin } from '@/lib/auth/guards'
import { verifyCsrf } from '@/lib/security/csrf'

const lessonSchema = z.object({
  courseId: z.string().min(1, 'معرف الدورة مطلوب'),
  title: z.string().min(1, 'عنوان الدرس مطلوب'),
  description: z.string().min(1, 'وصف الدرس مطلوب'),
  content: z.string().min(1, 'محتوى الدرس مطلوب'),
  order: z.number().int().positive('ترتيب الدرس يجب أن يكون رقماً موجباً'),
  duration: z.number().int().positive('مدة الدرس يجب أن تكون رقماً موجباً').optional(),
  videoUrl: z.string().url('رابط الفيديو يجب أن يكون رابطاً صالحاً').optional().or(z.literal('')),
  resources: z.string().optional() // JSON string
})

// GET: جلب جميع الدروس لدورة معينة
export async function GET(request: Request) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json({ message: 'معرف الدورة مطلوب.' }, { status: 400 })
    }

    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ lessons })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ message: 'غير مصرح لك بالوصول إلى هذه الصفحة.' }, { status: 403 })
    }
    console.error('خطأ في جلب الدروس:', error)
    return NextResponse.json({ message: 'حدث خطأ أثناء جلب الدروس.' }, { status: 500 })
  }
}

// POST: إنشاء درس جديد
export async function POST(request: Request) {
  try {
    await requireAdmin()

    const csrfValid = await verifyCsrf(request)
    if (!csrfValid) {
      return NextResponse.json(
        { message: 'رمز الحماية غير صالح. يرجى تحديث الصفحة والمحاولة مرة أخرى.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const parsed = lessonSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'بيانات غير صالحة', errors: parsed.error.errors },
        { status: 400 }
      )
    }

    // التحقق من وجود الدورة
    const course = await prisma.course.findUnique({
      where: { id: parsed.data.courseId }
    })

    if (!course) {
      return NextResponse.json({ message: 'الدورة غير موجودة.' }, { status: 404 })
    }

    const lesson = await prisma.lesson.create({
      data: {
        courseId: parsed.data.courseId,
        title: parsed.data.title,
        description: parsed.data.description,
        content: parsed.data.content,
        order: parsed.data.order,
        duration: parsed.data.duration || null,
        videoUrl: parsed.data.videoUrl || null,
        resources: parsed.data.resources || null
      }
    })

    return NextResponse.json({ lesson, message: 'تم إنشاء الدرس بنجاح.' }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ message: 'غير مصرح لك بالوصول إلى هذه الصفحة.' }, { status: 403 })
    }
    console.error('خطأ في إنشاء الدرس:', error)
    return NextResponse.json({ message: 'حدث خطأ أثناء إنشاء الدرس.' }, { status: 500 })
  }
}
