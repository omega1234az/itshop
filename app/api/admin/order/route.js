// pages/api/admin/order/index.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all orders from the database, including the user and order_details (with product details)
    const orders = await prisma.orders.findMany({
      include: {
        user: true, // Include user details if needed
        order_details: {
          include: {
            product: true, // Include product details for each order_detail
          },
        },
      },
    });

    // Map over the orders and include product names in order_details
    const mappedOrders = orders.map(order => ({
      ...order,
      order_details: order.order_details.map(detail => ({
        ...detail,
        product_name: detail.product.name, // Add the product name from the product model
      })),
    }));

    return NextResponse.json(mappedOrders);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
  
  // Handle other HTTP methods (if needed)
  return NextResponse.json({ error: 'Method Not Allowed' });
}
