import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";
import sharp from "sharp";

const prisma = new PrismaClient();

export async function PUT(req) {
  try {
    const user_id = req.headers.get("x-user-id");
    if (!user_id) {
      return new Response(JSON.stringify({ message: "ไม่ได้รับ user_id" }), { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get("name");
    const phone = formData.get("phone");
    const address = formData.get("address");
    const file = formData.get("file");

    let updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    if (file) {
      try {
        // อ่านไฟล์เป็น Buffer
        const fileBuffer = await file.arrayBuffer();
        
        // ประมวลผลและบีบอัดรูปภาพ
        const compressedImageBuffer = await sharp(Buffer.from(fileBuffer))
          .resize(500, 500, { // ปรับขนาดสูงสุด 800x800 px
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ // แปลงเป็น JPEG และบีบอัด
            quality: 65,
            progressive: true
          })
          .toBuffer();

        // สร้าง Blob จาก Buffer ที่บีบอัดแล้ว
        const compressedBlob = new Blob([compressedImageBuffer], { type: 'image/jpeg' });
        
        const fileName = `profile-${user_id}.jpg`;
        const blob = await put(`profiles/${fileName}`, compressedBlob, {
          access: "public",
          handleUploadUrl: async (existingUrl) => {
            if (existingUrl) {
              return existingUrl;
            }
            return `profiles/${fileName}`;
          },
        });
        updateData.img = blob.url;
      } catch (imageError) {
        console.error("การประมวลผลรูปภาพล้มเหลว:", imageError);
        return new Response(
          JSON.stringify({ message: "เกิดข้อผิดพลาดในการประมวลผลรูปภาพ" }), 
          { status: 400 }
        );
      }
    }

    if (Object.keys(updateData).length === 0) {
      return new Response(
        JSON.stringify({ message: "ไม่มีข้อมูลที่ต้องการอัปเดต" }), 
        { status: 400 }
      );
    }

    const updatedUser = await prisma.users.update({
      where: { user_id: parseInt(user_id) },
      data: updateData,
      select: {
        user_id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        img: true,
      },
    });

    return new Response(
      JSON.stringify({ message: "อัปเดตข้อมูลสำเร็จ", user: updatedUser }), 
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }), 
      { status: 500 }
    );
  }
}