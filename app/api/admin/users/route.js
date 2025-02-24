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

    // ใช้ค่า total_spent ที่มีอยู่แล้วในข้อมูล user
    const usersWithTotalSpent = users.map(user => {
      return {
        ...user,
        total_spent: user.total_spent, // ใช้ค่า total_spent ที่มีอยู่แล้ว
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
