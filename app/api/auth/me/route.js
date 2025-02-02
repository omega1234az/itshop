import { PrismaClient } from '@prisma/client'
import { z } from 'zod'  // ✅ Import Zod

const prisma = new PrismaClient()

export async function GET(request) {
  // ✅ ดึงข้อมูลผู้ใช้จาก Headers
  const user_id = request.headers.get('X-User-ID');
  const email = request.headers.get('X-User-Email');
  const role = request.headers.get('X-User-Role');
  const img = request.headers.get('X-User-Img');

  console.log('✅ User data from headers:', { user_id, email, role, img });

  // ✅ ตรวจสอบว่า user_id, email, และ role มีค่าหรือไม่
  if (!user_id || !email || !role) {
    return new Response(
      JSON.stringify({ message: 'ข้อมูลผู้ใช้ไม่ครบถ้วน' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ✅ ดึงข้อมูลผู้ใช้จากฐานข้อมูล
  const user = await prisma.users.findUnique({
    where: { email },
  });

  // ✅ ตรวจสอบว่าเจอผู้ใช้หรือไม่
  if (!user) {
    return new Response(
      JSON.stringify({ message: 'ไม่พบข้อมูลผู้ใช้' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ✅ ส่งข้อมูลผู้ใช้กลับไปในรูปแบบที่ต้องการ
  return new Response(
    JSON.stringify({
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      created_at: user.created_at,
      total_spent: user.total_spent,
      img: user.img,
    }), 
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
