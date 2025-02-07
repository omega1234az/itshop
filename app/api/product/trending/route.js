import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 8; // กำหนดค่าเริ่มต้นเป็น 10 ถ้าไม่มีการส่งค่า limit มา

    // ✅ ดึงข้อมูลสินค้าตามจำนวนที่กำหนดและเรียงตาม view_count
    const products = await prisma.products.findMany({
      include: {
        category: true,
        sub_category: true
      },
      orderBy: {
        view_count: 'desc'
      },
      take: limit // กำหนดจำนวนสินค้าที่ต้องการ
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching trending products:', error);
    return NextResponse.json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า' }, { status: 500 });
  }
}
