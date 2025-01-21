import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  let token = request.headers.get('Authorization');
  const sessionCookie = request.cookies.get('session_id'); // ✅ ดึง token จาก Cookie

  try {
    if (!token && sessionCookie) {
      token = sessionCookie.value; // ✅ ใช้ token จาก Cookie ถ้าไม่มีใน Header
    }

    if (!token) {
      return NextResponse.json({ message: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
    }

    // 🔹 ถ้ามี "Bearer " ให้นำออก
    const jwtToken = token.startsWith('Bearer ') ? token.substring(7) : token;

    // ✅ ตรวจสอบและถอดรหัส Token
    const { payload } = await jwtVerify(jwtToken, new TextEncoder().encode(process.env.JWT_SECRET));

    // 🔹 ตรวจสอบ payload ที่ได้รับ
    if (!payload || !payload.user_id || !payload.email || !payload.role) {
      return NextResponse.json({ message: 'ข้อมูลผู้ใช้ไม่สมบูรณ์' }, { status: 400 });
    }

    console.log('✅ ตรวจสอบ Token สำเร็จ:', payload);

    // ✅ อ่าน Body เดิมจาก Request
    let body = {};
    if (request.body) {
      try {
        body = await request.json(); // อ่าน Body เดิม
      } catch (error) {
        console.warn("⚠️ ไม่สามารถอ่าน JSON Body ได้ อาจเป็น Request ที่ไม่มี Body");
      }
    }

    // ✅ แนบข้อมูลผู้ใช้ลงใน Body
    const newBody = JSON.stringify({
      ...body, // ข้อมูลเดิม
      user_id: payload.user_id,
      email: payload.email,
      role: payload.role,
      img: payload.img || "",
    });

    // ✅ ส่ง Request ใหม่พร้อม Body ที่แก้ไข
    return new NextResponse(newBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('❌ Error in middleware:', error);
    return NextResponse.json({ message: 'Token ไม่ถูกต้อง', error: error.message }, { status: 403 });
  }
}

// 🔹 ระบุ API ที่ใช้ Middleware
export const config = {
  matcher: [
    '/api/admin/:path*',  // ใช้กับ API ภายใต้ /api/admin/*
    '/api/auth/me',       // ใช้กับ /api/auth/me
  ],
};
