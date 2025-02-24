import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  try {
    // ดึง user_id จาก params
    const { id } = await params; // user_id จะอยู่ใน params ของ URL
    if (!id) {
      return NextResponse.json(
        { message: "ไม่ได้รับ user_id" },
        { status: 400 }
      );
    }

    // ดึงข้อมูลจาก body (JSON)
    const data = await req.json();

    // เตรียมข้อมูลที่จะอัปเดต
    let updateData = {};

    // ตรวจสอบและเพิ่มข้อมูลที่ต้องการอัปเดต
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email; // เพิ่มการตรวจสอบ email
    if (data.role) updateData.role = data.role;
    
    // ตรวจสอบ status และแปลงให้เป็น 0 หรือ 1
    if (data.status !== undefined) {
      // แปลงค่า status ให้เป็น 0 หรือ 1
      updateData.status = data.status === 1 ? 1 : 0;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "ไม่มีข้อมูลที่ต้องการอัปเดต" },
        { status: 400 }
      );
    }

    // อัปเดตผู้ใช้ในฐานข้อมูล
    const updatedUser = await prisma.users.update({
      where: { user_id: parseInt(id) }, // ใช้ user_id ที่ดึงมาจาก params
      data: updateData,
      select: {
        user_id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    return NextResponse.json(
      { message: "อัปเดตข้อมูลสำเร็จ", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" },
      { status: 500 }
    );
  }
}
