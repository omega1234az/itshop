import { PrismaClient } from '@prisma/client';
import { put } from '@vercel/blob';
import sharp from 'sharp';

const prisma = new PrismaClient();

// สำหรับการเพิ่มสินค้า (POST)
export async function POST(req) {
  try {
    const formData = await req.formData(); // ใช้ formData แทน req.json()

    const name = formData.get('name');
    const description = formData.get('description');
    const price = parseFloat(formData.get('price'));
    const stock = parseInt(formData.get('stock'));
    const category_id = parseInt(formData.get('category_id'));
    const sub_category_id = parseInt(formData.get('sub_category_id'));
    const img = formData.get('img'); // ไฟล์รูปภาพ

    let imgUrl = null;

    // หากมีไฟล์รูปภาพ
    if (img) {
      try {
        // อ่านไฟล์เป็น Buffer
        const imgBuffer = await img.arrayBuffer();

        // บีบอัดและแปลงไฟล์ภาพด้วย sharp
        const compressedImgBuffer = await sharp(Buffer.from(imgBuffer))
          .resize(500, 500, { // ปรับขนาดสูงสุดที่ 500x500 px
            fit: 'inside',
            withoutEnlargement: true,
          })
          .jpeg({
            quality: 65, // คุณภาพ 65%
            progressive: true,
          })
          .toBuffer();

        // สร้าง Blob จาก Buffer ที่บีบอัดแล้ว
        const compressedBlob = new Blob([compressedImgBuffer], { type: 'image/jpeg' });

        // ตั้งชื่อไฟล์ (สามารถปรับได้ตามต้องการ)
        const fileName = `product-${Date.now()}.jpg`;

        // อัปโหลดไปยัง Vercel Blob
        const blob = await put(`products/${fileName}`, compressedBlob, {
          access: 'public',
          handleUploadUrl: async (existingUrl) => {
            if (existingUrl) {
              return existingUrl;
            }
            return `products/${fileName}`;
          },
        });

        // บันทึก URL ของไฟล์ที่อัปโหลดในฐานข้อมูล
        imgUrl = blob.url;
      } catch (imageError) {
        console.error('การประมวลผลรูปภาพล้มเหลว:', imageError);
        return new Response(
          JSON.stringify({ message: 'เกิดข้อผิดพลาดในการประมวลผลรูปภาพ' }),
          { status: 400 }
        );
      }
    }

    // สร้างข้อมูลสินค้าใหม่
    const newProduct = await prisma.products.create({
      data: {
        name,
        description,
        price,
        stock,
        category_id,
        sub_category_id,
        img: imgUrl, // URL ของไฟล์ที่อัปโหลด
        status: 1, // ตั้งสถานะเริ่มต้นเป็น 1 (Active)
      },
    });

    return new Response(JSON.stringify(newProduct), { status: 201 });
  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error);
    return new Response(
      JSON.stringify({ message: 'ไม่สามารถเพิ่มสินค้าได้', error: error.message }),
      { status: 500 }
    );
  }
}
