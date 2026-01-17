import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import crypto from 'crypto'
import { sql, getFirst } from '@/lib/db/neon'
import { getSessionUser } from '@/lib/auth/guards'

export async function GET(_request: NextRequest, context: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await context.params
  const session = await getSessionUser()
  if (!session) {
    return NextResponse.json({ message: 'غير مصرح.' }, { status: 401 })
  }

  const enrollmentResults = await sql`
    SELECT 
      e.*,
      json_build_object(
        'id', c.id,
        'title', c.title,
        'category', c.category
      ) as course,
      json_build_object(
        'id', u.id,
        'name', u.name,
        'email', u.email
      ) as user
    FROM enrollments e
    JOIN courses c ON e."courseId" = c.id
    JOIN users u ON e."userId" = u.id
    WHERE e."userId" = ${session.id} AND e."courseId" = ${courseId}
    LIMIT 1
  `
  let enrollment = getFirst(enrollmentResults)

  if (!enrollment || enrollment.status !== 'COMPLETED') {
    return NextResponse.json({ message: 'غير مؤهل للشهادة.' }, { status: 403 })
  }

  const certificateId = enrollment.certificateId ?? crypto.randomUUID()
  if (!enrollment.certificateId) {
    const updatedResults = await sql`
      UPDATE enrollments 
      SET "certificateId" = ${certificateId},
          "certificateUrl" = ${enrollment.certificateUrl ?? `/api/certificates/${courseId}`},
          "updatedAt" = ${new Date()}
      WHERE id = ${enrollment.id}
      RETURNING *
    `
    const updated = getFirst(updatedResults)
    
    if (updated) {
      // إعادة جلب البيانات مع العلاقات
      const fullEnrollmentResults = await sql`
        SELECT 
          e.*,
          json_build_object(
            'id', c.id,
            'title', c.title,
            'category', c.category
          ) as course,
          json_build_object(
            'id', u.id,
            'name', u.name,
            'email', u.email
          ) as user
        FROM enrollments e
        JOIN courses c ON e."courseId" = c.id
        JOIN users u ON e."userId" = u.id
        WHERE e.id = ${updated.id}
        LIMIT 1
      `
      const fullEnrollment = getFirst(fullEnrollmentResults)
      if (fullEnrollment) {
        enrollment = fullEnrollment
      }
    }
  }

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([842, 595])
  const { width, height } = page.getSize()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  page.drawRectangle({ x: 30, y: 30, width: width - 60, height: height - 60, borderColor: rgb(0.39, 0.4, 0.94), borderWidth: 2 })

  page.drawText('شهادة إتمام الدورة', {
    x: 300,
    y: height - 120,
    size: 24,
    font,
    color: rgb(0.1, 0.1, 0.2)
  })

  const completionDate = new Intl.DateTimeFormat('ar', { dateStyle: 'medium' }).format(enrollment.updatedAt)

  page.drawText(`اسم الطالب: ${enrollment.user.name}`, { x: 120, y: height - 200, size: 16, font })
  page.drawText(`عنوان الدورة: ${enrollment.course.title}`, { x: 120, y: height - 230, size: 16, font })
  page.drawText(`تاريخ الإتمام: ${completionDate}`, { x: 120, y: height - 260, size: 16, font })
  page.drawText(`معرف الشهادة: ${certificateId}`, { x: 120, y: height - 290, size: 12, font })

  page.drawText('د. عامر سلمان أورابي', { x: 120, y: 120, size: 14, font, color: rgb(0.2, 0.2, 0.3) })
  page.drawText('دكتوراه في التغذية السريرية والعلاج الوظيفي', { x: 120, y: 100, size: 10, font, color: rgb(0.3, 0.3, 0.4) })

  const pdfBytes = await pdfDoc.save()

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=certificate-${courseId}.pdf`
    }
  })
}
