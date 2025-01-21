import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    // รับข้อมูลจาก request body
    const { email, password } = await request.json()

    console.log('Received email:', email)  // Log สำหรับตรวจสอบอีเมล

    // ค้นหาผู้ใช้จากอีเมล
    const user = await prisma.users.findUnique({
      where: { email },
    })

    console.log('User found:', user)  // Log ตรวจสอบข้อมูลผู้ใช้

    // หากไม่พบผู้ใช้
    if (!user) {
      return new Response(
        JSON.stringify({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }),
        { status: 400 }
      )
    }

    // ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.password)
    console.log('Password match:', isMatch)  // Log สำหรับตรวจสอบการเปรียบเทียบรหัสผ่าน

    if (!isMatch) {
      return Response.json({
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
      }, { status: 400 })
    }

    // สร้าง JWT Token
    const token = await new SignJWT({ user_id: user.user_id, email: user.email, role: user.role ,img: user.img})
      .setProtectedHeader({ alg: 'HS256' })  // เพิ่มการตั้งค่า Protected Header
      .setExpirationTime('7d')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET))

    console.log('JWT Token created:', token)  // Log สำหรับตรวจสอบการสร้าง Token

    // สร้าง cookie สำหรับ session_id (เช่นใช้ token เป็น session_id)
    const cookie = `session_id=${token}; HttpOnly; Secure; Path=/; Max-Age=604800`  // หมดอายุใน 7 วัน

    // ส่ง Response กลับ
    return new Response(
      JSON.stringify({
        message: 'เข้าสู่ระบบสำเร็จ',
        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
          img :user.img,
          created_at: user.created_at
        }
      }),
      {
        status: 200,
        headers: {
          'Set-Cookie': cookie,  // ตั้งค่าคุกกี้
        }
      }
    )
  } catch (error) {
    console.error('Error in POST request:', error)  // Log ข้อผิดพลาด
    return Response.json({
      message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
    }, { status: 500 })
  }
}
