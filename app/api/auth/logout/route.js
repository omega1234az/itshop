import { deleteCookie } from "cookies-next";
import { NextResponse } from "next/server";

export async function POST(req) {
  const res = NextResponse.json({ message: "Logged out" });
  
  // ลบคุกกี้ session_id จากการเรียก API นี้
  deleteCookie("session_id", { req, res });

  return res;
}
