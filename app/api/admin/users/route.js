import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // ดึงข้อมูลผู้ใช้ทั้งหมดพร้อมรายละเอียดการสั่งซื้อและการชำระเงิน
    const users = await prisma.users.findMany({
      include: {
        orders: {
          include: {
            order_details: true,
          },
        },
        payments: true,
      },
    });

    // คำนวณจำนวนเงินที่ใช้จ่ายทั้งหมดสำหรับผู้ใช้แต่ละคน
    const usersWithTotalSpent = users.map(user => {
      const totalSpent = user.orders.reduce((sum, order) => {
        // คำนวณค่าใช้จ่ายทั้งหมดจาก order_details
        return sum + order.order_details.reduce((detailSum, detail) => {
          return detailSum + (detail.price * detail.quantity);
        }, 0);
      }, 0) + user.payments.reduce((sum, payment) => sum + payment.amount, 0);

      return {
        ...user,
        total_spent: totalSpent,
      };
    });

    // คัดกรอง 3 อันดับแรกที่ใช้จ่ายมากที่สุด
    const top3Users = usersWithTotalSpent
      .sort((a, b) => b.total_spent - a.total_spent)
      .slice(0, 3);

    return NextResponse.json({
      allUsers: usersWithTotalSpent,
      top3Users,
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' });
  }
}
