import { PrismaClient } from '@prisma/client' // Import Prisma Client
import twilio from 'twilio'
import { NextResponse } from 'next/server';
const prisma = new PrismaClient()
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN=process.env.TWILIO_AUTH_TOKEN
const TWILIO_SERVICE_SID =process.env.TWILIO_SERVICE_SID
// Twilio Client
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
const VERIFY_SERVICE_SID = TWILIO_SERVICE_SID

export async function POST(request) {
    try {
        const body = await request.json()

        // ตรวจสอบว่า body และ phone มีข้อมูลหรือไม่
        if (!body || !body.phone) {
            return NextResponse.json({ message: 'หมายเลขโทรศัพท์ไม่ถูกต้อง' }, { status: 400 })
        }

        let { phone } = body

        // ตรวจสอบและแปลงหมายเลขให้เป็นรูปแบบสากล (E.164)
        if (!phone.startsWith('+')) {
          if (phone.startsWith('0')) {
            phone = '+66' + phone.slice(1) // แปลง 095xxxxxxx → +6695xxxxxxx
          } else {
            return NextResponse.json({ message: 'หมายเลขโทรศัพท์ไม่ถูกต้อง' }, { status: 400 })
          }
        }

        // ตรวจสอบเบอร์โทรศัพท์ในฐานข้อมูล
        const existingUser = await prisma.users.findUnique({
          where: { phone : body.phone},
        })


        if (existingUser) {
            // ถ้ามีผู้ใช้ที่มีหมายเลขนี้แล้ว
            return NextResponse.json({ message: 'หมายเลขโทรศัพท์นี้ถูกใช้ไปแล้ว' }, { status: 400 })
        }

        // ถ้าเบอร์โทรศัพท์ไม่ซ้ำ ส่ง OTP ไปยังเบอร์
        await twilioClient.verify.services(VERIFY_SERVICE_SID)
          .verifications
          .create({ to: phone, channel: 'sms' })

        return NextResponse.json({ message: 'ส่ง OTP สำเร็จ' }, { status: 200 })
    } catch (error) {
        console.error('Error in sending OTP:', error)
        return  NextResponse.json({ message: 'เกิดข้อผิดพลาดในการส่ง OTP' }, { status: 500 })
    }
}
