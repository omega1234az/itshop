// app/api/admin/product/route.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// สำหรับการเพิ่มสินค้า (POST)
export async function POST(req) {
  const { name, description, price, stock, category_id, sub_category_id, img } = await req.json();

  try {
    const newProduct = await prisma.products.create({
      data: {
        name,
        description,
        price,
        stock,
        category_id,
        sub_category_id,
        img,
        status: 1, // ตั้งสถานะเริ่มต้นเป็น 1 (Active)
      },
    });

    return new Response(JSON.stringify(newProduct), { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return new Response(JSON.stringify({ message: 'ไม่สามารถเพิ่มสินค้าได้', error: error.message }), { status: 500 });
  }
}

// สำหรับการแก้ไขและลบสินค้า (PUT/DELETE)


