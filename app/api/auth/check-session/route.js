import { getCookie } from "cookies-next";
import { NextResponse } from "next/server";

export async function GET(request) {
  const sessionCookie = request.cookies.get('session_id');

  if (sessionCookie) {
    return NextResponse.json({ isLoggedIn: true, session_id: sessionCookie });
  } else {
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }
}
