import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { email, password, name } = await request.json()

    // ตรวจสอบว่าอีเมลมีอยู่ในฐานข้อมูลหรือยัง
    const existingUser = await prisma.users.findUnique({
      where: { email },
    })

    if (existingUser) {
      return Response.json({ message: 'อีเมลนี้ถูกใช้งานแล้ว' }, { status: 400 })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // สร้างผู้ใช้ใหม่
    const user = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    })
    
    // อัปเดตรูปภาพหลังจากที่ user ถูกสร้างแล้ว
    const updatedUser = await prisma.users.update({
      where: { user_id: user.user_id },
      data: { img: "default.jpg" }
    })

    return await Response.json({ 
      message: 'ผู้ใช้ถูกสร้างเรียบร้อยแล้ว', 
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        img: user.img,
        created_at: user.created_at
      }
    }, { status: 201 })

  } catch (error) {
    return Response.json({ message: error.message }, { status: 400 })
  }
}
