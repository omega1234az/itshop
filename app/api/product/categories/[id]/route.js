import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    console.log(id) // ใช้ params.id โดยตรง
    if (!id) {
      return new Response('Category ID is required', { status: 400 });
    }

    const products = await prisma.products.findMany({
      where: {
        category_id: parseInt(id), // แปลง id เป็นตัวเลข
      },
      include: {
        category: true,
        sub_category: true,
      },
    });

    if (!products.length) {
      return new Response('No products found for this category', { status: 404 });
    }

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
