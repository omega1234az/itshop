// pages/api/admin/products/[id].js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  const { id } = await params;
  const { name, description, price, stock, category_id, sub_category_id, img, status } = await req.json();
  
  // สร้างอ็อบเจ็กต์ data ใหม่ที่จะอัปเดต โดยใช้เฉพาะค่าที่ไม่ใช่ undefined
  const dataToUpdate = {};
  
  if (name !== undefined) dataToUpdate.name = name;
  if (description !== undefined) dataToUpdate.description = description;
  if (price !== undefined) dataToUpdate.price = price;
  if (stock !== undefined) dataToUpdate.stock = stock;
  if (category_id !== undefined) dataToUpdate.category_id = category_id;
  if (sub_category_id !== undefined) dataToUpdate.sub_category_id = sub_category_id;
  if (img !== undefined) dataToUpdate.img = img;
  if (status !== undefined) dataToUpdate.status = status;

  try {
    const updatedProduct = await prisma.products.update({
      where: { product_id: parseInt(id) },
      data: dataToUpdate, // ใช้ข้อมูลที่ต้องการอัปเดต
    });

    return new Response(JSON.stringify(updatedProduct), { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return new Response(JSON.stringify({ message: 'ไม่สามารถแก้ไขสินค้าได้', error: error.message }), { status: 500 });
  }
}

  
  // สำหรับการลบสินค้า (DELETE)
  export async function DELETE(req, { params }) {
    const { id } = await params;
  
    try {
      const deletedProduct = await prisma.products.update({
        where: { product_id: parseInt(id) },
        data: {
          status: -1, // ตั้งสถานะสินค้าเป็น -1 (Deleted)
        },
      });
  
      return new Response(JSON.stringify(deletedProduct), { status: 200 });
    } catch (error) {
      console.error('Error deleting product:', error);
      return new Response(JSON.stringify({ message: 'ไม่สามารถลบสินค้าได้', error: error.message }), { status: 500 });
    }
  }