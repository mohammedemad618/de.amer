import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { requireAdmin } from '@/lib/auth/guards'
import { verifyCsrfFromToken } from '@/lib/security/csrf'

export const runtime = 'nodejs'
export const maxDuration = 30

// POST: رفع صورة
export async function POST(request: Request) {
  try {
    await requireAdmin()

    // قراءة FormData مرة واحدة
    const formData = await request.formData()
    
    // التحقق من CSRF token من FormData أو header
    const formDataToken = formData.get('csrfToken') as string | null
    const headerToken = request.headers.get('x-csrf-token')
    const csrfToken = formDataToken || headerToken
    
    // التحقق من CSRF
    const csrfValid = await verifyCsrfFromToken(csrfToken)
    
    if (!csrfValid) {
      return NextResponse.json(
        { message: 'رمز الحماية غير صالح. يرجى تحديث الصفحة والمحاولة مرة أخرى.' },
        { status: 403 }
      )
    }

    const file = formData.get('file') as File | null
    const type = formData.get('type') as string | null // 'course' أو 'lesson'

    if (!file) {
      return NextResponse.json({ message: 'لم يتم رفع أي ملف.' }, { status: 400 })
    }

    // التحقق من نوع الملف
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: 'نوع الملف غير مدعوم. يرجى رفع صورة (JPEG, PNG, WebP, GIF).' },
        { status: 400 }
      )
    }

    // التحقق من حجم الملف (10MB كحد أقصى)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: 'حجم الملف كبير جداً. الحد الأقصى هو 10MB.' },
        { status: 400 }
      )
    }

    // إنشاء مجلد الرفع إذا لم يكن موجوداً
    const uploadDir = type === 'course' ? 'public/uploads/courses' : 'public/uploads/lessons'
    const uploadPath = join(process.cwd(), uploadDir)
    
    if (!existsSync(uploadPath)) {
      await mkdir(uploadPath, { recursive: true })
    }

    // إنشاء اسم فريد للملف
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const fileName = `${timestamp}-${randomString}.${fileExtension}`
    const filePath = join(uploadPath, fileName)

    // حفظ الملف
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // إرجاع مسار الملف النسبي
    const relativePath = `/${uploadDir.replace('public/', '')}/${fileName}`

    return NextResponse.json({
      success: true,
      path: relativePath,
      fileName,
      size: file.size,
      type: file.type
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ message: 'غير مصرح لك بالوصول إلى هذه الصفحة.' }, { status: 403 })
    }
    console.error('خطأ في رفع الصورة:', error)
    return NextResponse.json({ message: 'حدث خطأ أثناء رفع الصورة.' }, { status: 500 })
  }
}
