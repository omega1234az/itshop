import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

// ดึงรายการหมวดหมู่ทั้งหมด (GET)
export async function GET() {
  try {
    const categories = await prisma.categories.findMany({
      include: {
        sub_categories: true, // รวมข้อมูล subcategories ด้วย
      },
    });

    return NextResponse.json((categories), { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(({ message: 'ไม่สามารถดึงข้อมูลหมวดหมู่ได้', error: error.message }), { status: 500 });
  }
}
