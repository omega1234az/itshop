import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import twilio from 'twilio'

const prisma = new PrismaClient()

// Twilio Client
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN=process.env.TWILIO_AUTH_TOKEN
const TWILIO_SERVICE_SID =process.env.TWILIO_SERVICE_SID
// Twilio Client
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
const VERIFY_SERVICE_SID = TWILIO_SERVICE_SID
// ✅ Schema Validation ด้วย Zod
const registerSchema = z.object({
  name: z.string().min(3, { message: 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร' }),
  email: z.string().email({ message: 'อีเมลไม่ถูกต้อง' }),
  password: z.string().min(6, { message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' }),
  recaptchaToken: z.string().min(1, { message: 'โปรดยืนยันว่าไม่ใช่บอท' }),
  phone: z.string().min(3, { message: 'OTP ต้องมี 6 ตัว' }), // ✅ เพิ่ม reCAPTCHA
  otp: z.string().min(6, { message: 'OTP ต้องมี 6 ตัว' }) // เพิ่ม OTP สำหรับการตรวจสอบ
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

// ✅ ฟังก์ชันตรวจสอบ OTP ด้วย Twilio
// ✅ ฟังก์ชันตรวจสอบ OTP ด้วย Twilio
const verifyOTP = async (phone , otp) => {
  try {
    // ตรวจสอบว่าเบอร์โทรศัพท์มีเครื่องหมาย + หรือไม่
    if (!phone.startsWith('+')) {
      if (phone.startsWith('0')) {
        phone = '+66' + phone.slice(1) // สำหรับประเทศไทยแปลงหมายเลขจาก 0 -> +66
      } else {
        throw new Error('หมายเลขโทรศัพท์ไม่ถูกต้อง')
      }
    }

    // ทำการตรวจสอบ OTP ผ่าน Twilio
    const verificationCheck = await twilioClient.verify.services(VERIFY_SERVICE_SID)
      .verificationChecks
      .create({ to: phone, code: otp })

    return verificationCheck.status === 'approved'
  } catch (error) {
    console.error('Error in OTP verification:', error)
    return false
  }
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

    const { email, password, name, recaptchaToken, otp, phone } = parseResult.data

    // ✅ ตรวจสอบ reCAPTCHA Token
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken)
    if (!isRecaptchaValid) {
      return new Response(
        JSON.stringify({ message: 'การยืนยัน reCAPTCHA ล้มเหลว' }),
        { status: 400 }
      )
    }

    // ✅ ตรวจสอบ OTP
    const isOtpValid = await verifyOTP(phone, otp)
    if (!isOtpValid) {
      return new Response(
        JSON.stringify({ message: 'OTP ไม่ถูกต้อง' }),
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
        phone, // เพิ่มเบอร์โทรศัพท์เพื่อใช้ในการยืนยัน OTP
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