import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    // ตรวจสอบว่ามีการส่งสถานะใหม่มาหรือไม่
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    // หาคำสั่งซื้อโดยใช้ id จาก params
    const order = await prisma.orders.findUnique({
      where: { order_id: Number(params.id) }, // ใช้ order_id ตามโครงสร้างฐานข้อมูล
    });

    // หากไม่พบคำสั่งซื้อ
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // อัปเดตสถานะของคำสั่งซื้อ
    const updatedOrder = await prisma.orders.update({
      where: { order_id: Number(id) },
      data: { status },
    });

    // ส่งคำสั่งซื้อที่อัปเดตแล้วกลับไป
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
