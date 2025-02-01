export async function GET(request) {
  // ✅ ดึงข้อมูลผู้ใช้จาก Headers
  const user_id = request.headers.get('X-User-ID');
  const email = request.headers.get('X-User-Email');
  const role = request.headers.get('X-User-Role');
  const img = request.headers.get('X-User-Img');

  console.log('✅ User data from headers:', { user_id, email, role, img });

  if (!user_id || !email || !role) {
    return new Response(JSON.stringify({ message: 'ข้อมูลผู้ใช้ไม่ครบถ้วน' }), { status: 400 });
  }

  return new Response(
    JSON.stringify({
      user_id,
      email,
      role,
      img
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
