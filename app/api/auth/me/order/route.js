import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request) {
  // ✅ ดึง user_id จาก Headers
  const user_id = request.headers.get('X-User-ID');

  if (!user_id) {
    return new Response(
      JSON.stringify({ message: 'ข้อมูลผู้ใช้ไม่ครบถ้วน' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // ✅ ตรวจสอบว่าผู้ใช้มีอยู่หรือไม่
    const user = await prisma.users.findUnique({
      where: { user_id: Number(user_id) },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ message: 'ไม่พบข้อมูลผู้ใช้' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ✅ ดึงออเดอร์ของผู้ใช้ พร้อมรายละเอียดสินค้า
    const orders = await prisma.orders.findMany({
        where: { user_id: Number(user_id) },
        include: {
          order_details: {
            include: {
              product: {
                select: {
                  product_id: true, // ✅ ต้องกำหนดค่าเป็น true
                  name: true,
                  price: true,
                  img: true,
                },
              },
            },
          },
          payments: {  // เพิ่มการดึงข้อมูลจาก payments
            select: {
              session_id: true,  // ดึงแค่ session_id จาก payments
            },
          },
        },
        orderBy: { order_date: 'desc' }, // เรียงลำดับจากออเดอร์ล่าสุด
      });
      

    return new Response(
      JSON.stringify({ orders }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    return new Response(
      JSON.stringify({ message: 'เกิดข้อผิดพลาดในระบบ' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
