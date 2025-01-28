import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export async function GET() {
  try {
    // ✅ ดึงข้อมูลสินค้าทั้งหมดจาก Database
    const products = await prisma.products.findMany({
      include: {
        category: true,
        sub_category: true
      }
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return NextResponse.json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า' }, { status: 500 });
  }
}
