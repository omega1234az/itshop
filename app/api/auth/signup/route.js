import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const prisma = new PrismaClient()

// ✅ Schema Validation ด้วย Zod
const registerSchema = z.object({
  name: z.string().min(3, { message: 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร' }),
  email: z.string().email({ message: 'อีเมลไม่ถูกต้อง' }),
  password: z.string().min(6, { message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' }),
  recaptchaToken: z.string().min(1, { message: 'โปรดยืนยันว่าไม่ใช่บอท' }) // ✅ เพิ่ม reCAPTCHA
})

// ✅ ฟังก์ชันตรวจสอบ reCAPTCHA กับ Google
const verifyRecaptcha = async (token) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY
  const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret: secretKey || '', response: token })
  })
  const data = await response.json()
  return data.success
}

export async function POST(request) {
  try {
    const body = await request.json()

    // ✅ ตรวจสอบข้อมูลที่รับเข้ามา
    const parseResult = registerSchema.safeParse(body)
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({
          message: parseResult.error.issues.map(issue => issue.message).join(', ')
        }),
        { status: 400 }
      )
    }

    const { email, password, name, recaptchaToken } = parseResult.data

    // ✅ ตรวจสอบ reCAPTCHA Token
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken)
    if (!isRecaptchaValid) {
      return new Response(
        JSON.stringify({ message: 'การยืนยัน reCAPTCHA ล้มเหลว' }),
        { status: 400 }
      )
    }

    // ✅ ตรวจสอบว่าอีเมลมีอยู่แล้วหรือไม่
    const existingUser = await prisma.users.findUnique({ where: { email } })
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'อีเมลนี้ถูกใช้งานแล้ว' }),
        { status: 400 }
      )
    }

    // ✅ Hash รหัสผ่านก่อนบันทึก
    const hashedPassword = await bcrypt.hash(password, 10)

    // ✅ สร้างผู้ใช้ใหม่
    const user = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name,
        img: 'default.jpg' // ✅ ตั้งค่าโปรไฟล์เริ่มต้น
      }
    })

    return new Response(
      JSON.stringify({
        message: 'สมัครสมาชิกสำเร็จ',
        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
          img: user.img,
          created_at: user.created_at
        }
      }),
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in register:', error)
    return new Response(
      JSON.stringify({ message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' }),
      { status: 500 }
    )
  }
}
