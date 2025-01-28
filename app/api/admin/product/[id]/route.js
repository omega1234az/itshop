// pages/api/admin/products/[id].js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
    const { id } = params;
    const { name, description, price, stock, category_id, sub_category_id, img, status } = await req.json();
  
    try {
      const updatedProduct = await prisma.products.update({
        where: { product_id: parseInt(id) },
        data: {
          name,
          description,
          price,
          stock,
          category_id,
          sub_category_id,
          img,
          status,
        },
      });
  
      return new Response(JSON.stringify(updatedProduct), { status: 200 });
    } catch (error) {
      console.error('Error updating product:', error);
      return new Response(JSON.stringify({ message: 'ไม่สามารถแก้ไขสินค้าได้', error: error.message }), { status: 500 });
    }
  }
  
  // สำหรับการลบสินค้า (DELETE)
  export async function DELETE(req, { params }) {
    const { id } = params;
  
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