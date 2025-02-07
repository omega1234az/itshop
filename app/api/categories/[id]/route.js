import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// ดึงหมวดหมู่ตาม id (GET)
export async function GET(req, { params }) {
  try {
    const { id } = params; // ดึง id จาก params
    if (!id) {
      return new NextResponse('ID is required', { status: 400 });
    }

    const category = await prisma.categories.findUnique({
      where: {
        category_id: parseInt(id), // แปลง id ให้เป็น integer
      },
      include: {
        sub_categories: true, // รวมข้อมูล subcategories ด้วย
      },
    });

    if (!category) {
      return new NextResponse('Category not found', { status: 404 });
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error('Error fetching category by id:', error);
    return NextResponse.json(
      { message: 'ไม่สามารถดึงข้อมูลหมวดหมู่ได้', error: error.message },
      { status: 500 }
    );
  }
}
