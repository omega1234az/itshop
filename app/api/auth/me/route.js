export async function GET(request) {
    const body = await request.json()  // ดึงข้อมูลจาก body
    const { user_id, email, role ,img} = body  // อ่านค่าที่ส่งมาใน body
  
    console.log('User data from body:', { user_id, email, role ,img})
  
    if (!user_id || !email || !role) {
      return new Response(JSON.stringify({ message: 'ข้อมูลผู้ใช้ไม่ครบถ้วน' }), { status: 400 })
    }
  
    return new Response(
      JSON.stringify({
        user_id,
        email,
        role,
        img
      }),
      { status: 200 }
    )
  }
  