import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db/prisma'
import { requireAdmin } from '@/lib/auth/guards'
import { verifyCsrf } from '@/lib/security/csrf'

const courseSchema = z.object({
  title: z.string().min(1, 'العنوان مطلوب'),
  category: z.string().min(1, 'الفئة مطلوبة'),
  description: z.string().min(1, 'الوصف مطلوب'),
  objectives: z.string().min(1, 'الأهداف مطلوبة'),
  hours: z.number().int().positive('عدد الساعات يجب أن يكون رقماً موجباً'),
  price: z.number().min(0, 'السعر يجب أن يكون رقماً موجباً أو صفر'),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], {
    errorMap: () => ({ message: 'المستوى يجب أن يكون: BEGINNER, INTERMEDIATE, أو ADVANCED' })
  }),
  thumbnail: z.string().min(1, 'صورة الدورة مطلوبة'), // يمكن أن يكون URL أو مسار محلي
  meetingLink: z.string().url('رابط الاجتماع يجب أن يكون رابطاً صالحاً').optional().or(z.literal(''))
})

// GET: جلب جميع الدورات (للمسؤول)
export async function GET() {
  try {
    await requireAdmin()

    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        enrollments: {
          select: {
            id: true,
            status: true,
            progressPercent: true
          }
        }
      }
    })

    return NextResponse.json({ courses })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ message: 'غير مصرح لك بالوصول إلى هذه الصفحة.' }, { status: 403 })
    }
    console.error('خطأ في جلب الدورات:', error)
    return NextResponse.json({ message: 'حدث خطأ أثناء جلب الدورات.' }, { status: 500 })
  }
}

// POST: إنشاء دورة جديدة
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
    const parsed = courseSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'بيانات غير صالحة', errors: parsed.error.errors },
        { status: 400 }
      )
    }

    const data = parsed.data
    const course = await prisma.course.create({
      data: {
        title: data.title,
        category: data.category,
        description: data.description,
        objectives: data.objectives,
        hours: data.hours,
        price: data.price,
        level: data.level,
        thumbnail: data.thumbnail,
        meetingLink: data.meetingLink || null
      }
    })

    return NextResponse.json({ course, message: 'تم إنشاء الدورة بنجاح.' }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ message: 'غير مصرح لك بالوصول إلى هذه الصفحة.' }, { status: 403 })
    }
    console.error('خطأ في إنشاء الدورة:', error)
    return NextResponse.json({ message: 'حدث خطأ أثناء إنشاء الدورة.' }, { status: 500 })
  }
}
