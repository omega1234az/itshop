import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import { z } from 'zod'

const prisma = new PrismaClient()

// ✅ Schema Validation ด้วย Zod
const loginSchema = z.object({
  email: z.string().email({ message: 'อีเมลไม่ถูกต้อง' }),
  password: z.string().min(6, { message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' }),
  recaptchaToken: z.string().min(1, { message: 'โปรดยืนยันว่าไม่ใช่บอท' }) // ✅ เพิ่ม reCAPTCHA
})

// ✅ ฟังก์ชันตรวจสอบ reCAPTCHA กับ Google
const verifyRecaptcha = async (token) => {
  const secretKey = process.env.SECRET_RECAPCHA
  const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret: SECRET_RECAPCHA || '', response: token })
  })
  const data = await response.json()
  return data.success
}

export async function POST(request) {
  try {
    const body = await request.json()

    // ✅ ตรวจสอบข้อมูลที่รับเข้ามา
    const parseResult = loginSchema.safeParse(body)
    if (!parseResult.success) {
      return Response.json({
        message: parseResult.error.issues.map(issue => issue.message).join(', ')
      }, { status: 400 })
    }

    const { email, password, recaptchaToken } = parseResult.data

    // ✅ ตรวจสอบ reCAPTCHA Token
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken)
    if (!isRecaptchaValid) {
      return Response.json({ message: 'การยืนยัน reCAPTCHA ล้มเหลว' }, { status: 400 })
    }

    // ✅ ค้นหาผู้ใช้จากอีเมล
    const user = await prisma.users.findUnique({ where: { email } })
    if (!user) {
      return new Response(JSON.stringify({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }), { status: 400 })
    }

    // ✅ ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return Response.json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }, { status: 400 })
    }

    // ✅ สร้าง JWT Token
    const token = await new SignJWT({ user_id: user.user_id, email: user.email, role: user.role, img: user.img })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1d')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET))

    const cookie = `session_id=${token}; HttpOnly; Secure; Path=/; Max-Age=86400`

    return Response.json(
      {
        message: 'เข้าสู่ระบบสำเร็จ',
        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
          img: user.img,
          created_at: user.created_at
        }
      },
      {
        status: 200,
        headers: { 'Set-Cookie': cookie }
      }
    )
  } catch (error) {
    console.error('Error in POST request:', error)
    return Response.json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' }, { status: 500 })
  }
}
