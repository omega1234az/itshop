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

async function checkStock(product_id) {
  const product = await prisma.products.findUnique({
    where: { product_id: parseInt(product_id) },
    select: { stock: true },
  });

  if (!product) return { error: "Product not found" };
  return { stock: product.stock };
}

// 🛒 เพิ่มสินค้าเข้าในตะกร้า
export async function POST(req) {
  try {
    const user_id = req.headers.get("X-User-ID");
    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is missing in headers" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { product_id, quantity } = body;

    if (!product_id || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: "Invalid product_id or quantity" },
        { status: 400 }
      );
    }

    // 🔎 เช็คสต็อกก่อน
    const stockCheck = await checkStock(product_id);
    if (stockCheck.error) {
      return NextResponse.json(
        { error: stockCheck.error },
        { status: 400 }
      );
    }

    // ตรวจสอบว่าจำนวนที่ต้องการเพิ่มเกินสต็อกทั้งหมดหรือไม่
    if (quantity > stockCheck.stock) {
      return NextResponse.json(
        { 
          error: "Requested quantity exceeds available stock",
          available_stock: stockCheck.stock,
          maximum_allowed: stockCheck.stock
        },
        { status: 400 }
      );
    }

    // ✅ หาจำนวนรวมของสินค้าชนิดเดียวกันในตะกร้า
    const existingCartItems = await prisma.cart.findMany({
      where: {
        user_id: parseInt(user_id),
        product_id: parseInt(product_id),
      },
    });

    const totalQuantityInCart = existingCartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const totalQuantityAfterAdd = totalQuantityInCart + quantity;

    // ตรวจสอบว่าจำนวนรวมทั้งหมดเกินสต็อกหรือไม่
    if (totalQuantityAfterAdd > stockCheck.stock) {
      return NextResponse.json(
        { 
          error: "Total quantity exceeds available stock",
          available_stock: stockCheck.stock,
          current_total: totalQuantityInCart,
          maximum_additional: stockCheck.stock - totalQuantityInCart
        },
        { status: 400 }
      );
    }

    // มีสินค้าในตะกร้าอยู่แล้ว
    if (existingCartItems.length > 0) {
      const existingCartItem = existingCartItems[0];
      
      // 🔄 อัปเดตจำนวนสินค้าในตะกร้า
      const updatedCartItem = await prisma.cart.update({
        where: { cart_id: existingCartItem.cart_id },
        data: { quantity: totalQuantityAfterAdd },
      });

      return NextResponse.json(
        { 
          message: "Updated cart item quantity",
          cart: updatedCartItem 
        },
        { status: 200 }
      );
    } 
    
    // 🆕 เพิ่มสินค้าใหม่ในตะกร้า
    const newCartItem = await prisma.cart.create({
      data: {
        user_id: parseInt(user_id),
        product_id: parseInt(product_id),
        quantity: quantity,
      },
    });

    return NextResponse.json(
      { 
        message: "Added item to cart",
        cart: newCartItem 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 🔄 อัปเดตจำนวนสินค้าในตะกร้า
export async function PUT(req) {
  try {
    const user_id = req.headers.get("X-User-ID");
    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is missing in headers" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { cart_id, quantity } = body;

    if (!cart_id || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: "Invalid cart_id or quantity" },
        { status: 400 }
      );
    }

    // ✅ ค้นหารายการในตะกร้า
    const existingCartItem = await prisma.cart.findUnique({
      where: { cart_id: parseInt(cart_id) },
    });

    if (!existingCartItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    // 🔎 เช็คสต็อกก่อนอัปเดต
    const stockCheck = await checkStock(existingCartItem.product_id);
    if (stockCheck.error) {
      return NextResponse.json(
        { error: stockCheck.error },
        { status: 400 }
      );
    }

    // ตรวจสอบว่าจำนวนที่ต้องการเกินสต็อกหรือไม่
    if (quantity > stockCheck.stock) {
      return NextResponse.json(
        { 
          error: "Requested quantity exceeds available stock",
          available_stock: stockCheck.stock
        },
        { status: 400 }
      );
    }

    // 🔄 อัปเดตจำนวนสินค้า
    const updatedCartItem = await prisma.cart.update({
      where: { cart_id: parseInt(cart_id) },
      data: { quantity: quantity },
    });

    return NextResponse.json(
      { 
        message: "Cart item updated successfully",
        cart: updatedCartItem 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}