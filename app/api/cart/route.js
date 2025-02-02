import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    // ดึงค่าจาก headers
    const user_id = request.headers.get("X-User-ID");

    // ตรวจสอบ user_id
    if (!user_id) {
      return NextResponse.json({ error: "User ID is missing in headers" }, { status: 400 });
    }

    const parsedUserId = parseInt(user_id);
    if (isNaN(parsedUserId)) {
      return NextResponse.json({ error: "Invalid User ID format" }, { status: 400 });
    }

    // ค้นหาตะกร้าสินค้าในฐานข้อมูล
    const cartItems = await prisma.cart.findMany({
      where: { user_id: parsedUserId },
      include: { product: true },
    });

    // แทนที่ 404 ด้วยการส่งกลับข้อความว่าไม่มีสินค้าในตะกร้า
    if (cartItems.length === 0) {
      return NextResponse.json({ message: "No items found in cart" }, { status: 200 });
    }

    // ตรวจสอบ stock
    const updatedCartItems = cartItems.map((item) => ({
      ...item,
      out_of_stock: item.quantity > item.product.stock, // ถ้าสินค้าไม่พอจะเป็น true
    }));

    return NextResponse.json(updatedCartItems, { status: 200 });

  } catch (error) {
    console.error("Error fetching cart items:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
