import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const { id } = await params; // เรียกใช้ params.id
    if (!id) {
      return new Response('ID is required', { status: 400 });
    }

    // อัปเดต view_count โดยเพิ่มขึ้นทีละ 1
    const product = await prisma.products.update({
      where: {
        product_id: parseInt(id), // แปลง id ให้เป็น integer ถ้าจำเป็น
      },
      data: {
        view_count: {
          increment: 1, // เพิ่ม view_count ทีละ 1
        },
      },
      include: {
        category: true,
        sub_category: true
      },
    });

    if (!product) {
      return new Response('Product not found', { status: 404 });
    }

    return new Response(JSON.stringify(product), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching product by id:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
