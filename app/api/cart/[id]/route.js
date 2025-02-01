import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req, { params }) {
  try {
    // ดึงค่าจาก headers
    const user_id = req.headers.get("X-User-ID");
    if (!user_id) {
      return NextResponse.json({ error: "User ID is missing in headers" }, { status: 400 });
    }

    const { id }  = await params;
    console.log(user_id);
    console.log(id);

    if (!id) {
      return NextResponse.json({ error: "cart_id is required" }, { status: 400 });
    }

    // ลบสินค้าในตะกร้าเฉพาะของ user นี้
    const deletedCartItem = await prisma.cart.deleteMany({
      where: {
        cart_id: parseInt(id),
        user_id: parseInt(user_id),
      },
    });

    if (deletedCartItem.count === 0) {
      return NextResponse.json({ error: "Cart item not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Cart item deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting cart item:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
