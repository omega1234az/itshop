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

    // 🔹 ตรวจสอบว่า path ที่เข้าไปเป็น API ของ admin หรือไม่
    if (request.url.includes('/api/admin') && payload.role !== 'admin') {
      return NextResponse.json({ message: 'คุณไม่มีสิทธิ์เข้าถึง API ของ admin' }, { status: 403 });
    }
    if (request.nextUrl.pathname.startsWith('/admin/dashboard') && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
   }

    // ✅ ใช้ Headers เพื่อส่งข้อมูลไปยัง API แทนการแก้ไข body
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('X-User-ID', payload.user_id);
    requestHeaders.set('X-User-Email', payload.email);
    requestHeaders.set('X-User-Role', payload.role);
    requestHeaders.set('X-User-Img', payload.img || "");

    return NextResponse.next({
      request: {
        headers: requestHeaders,
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
    '/api/auth/me',
    '/admin/dashboard/:path*',       // ใช้กับ /api/auth/me
  ],
};
