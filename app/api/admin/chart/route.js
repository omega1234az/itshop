
import { subDays, startOfMonth } from "date-fns";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const now = new Date();
    const firstDayOfMonth = startOfMonth(now);
    const fiveDaysAgo = subDays(now, 5);

    const totalSalesThisMonth = await prisma.orders.aggregate({
      _sum: { total_price: true },
      where: {
        order_date: { gte: firstDayOfMonth },
        status: "completed",
      },
    });

    // 2. จำนวนคำสั่งซื้อเดือนนี้
    const totalOrdersThisMonth = await prisma.orders.count({
      where: {
        order_date: { gte: firstDayOfMonth },
      },
    });

    // 3. สมาชิกที่สมัครเดือนนี้
    const newUsersThisMonth = await prisma.users.count({
      where: {
        created_at: { gte: firstDayOfMonth },
      },
    });

    // 4. จำนวนคำสั่งซื้อที่รอดำเนินการ
    const pendingOrders = await prisma.orders.count({
      where: {
        status: "processing",
      },
    });

    // 5. ยอดขายย้อนหลัง 5 วัน
    const salesLast5Days = await prisma.orders.findMany({
        where: {
          order_date: { gte: fiveDaysAgo },
          status: "completed",
        },
        select: {
          order_date: true,
          total_price: true,
        },
        orderBy: {
          order_date: "asc",
        },
      });
      
      const groupedSales = salesLast5Days.reduce((acc, order) => {
        const date = order.order_date.toISOString().split('T')[0]; // แปลงวันที่เป็นรูปแบบ yyyy-mm-dd
        if (!acc[date]) {
          acc[date] = { total_sales: 0 };
        }
        acc[date].total_sales += order.total_price;
        return acc;
      }, {});
      
      // แปลง groupedSales เป็น Array ในรูปแบบที่ต้องการ
      const salesLast5DaysFormatted = Object.keys(groupedSales).map(date => ({
        date: date,
        total_sales: groupedSales[date].total_sales,
      }));
      
      console.log({ sales_last_5_days: salesLast5DaysFormatted });
      
      
      const orderDetails = await prisma.order_details.findMany({
        include: {
          product: {
            select: {
              category_id: true,
            },
          },
        },
      });
      
      const categories = await prisma.categories.findMany(); // ดึงข้อมูลทุก categories
      
      // รวมยอดขายตามหมวดหมู่
      const salesByCategory = orderDetails.reduce((acc, orderDetail) => {
        const categoryId = orderDetail.product.category_id;
        if (!acc[categoryId]) {
          acc[categoryId] = { total_sales: 0 };
        }
        acc[categoryId].total_sales += orderDetail.price;
        return acc;
      }, {});
      
      // แปลงผลลัพธ์ให้เป็น Array พร้อมกับข้อมูลชื่อหมวดหมู่
      const salesByCategoryFormatted = categories.map(category => {
        const categoryId = category.category_id;
        return {
          category_id: categoryId,
          category_name: category.name, // ชื่อหมวดหมู่
          total_sales: salesByCategory[categoryId] ? salesByCategory[categoryId].total_sales : 0,
        };
      });
      
      console.log(salesByCategoryFormatted);
      
    // 6. ยอดขายตามหมวดหมู่
    

    return Response.json({
      total_sales_this_month: totalSalesThisMonth._sum.total_price || 0,
      total_orders_this_month: totalOrdersThisMonth,
      new_users_this_month: newUsersThisMonth,
      pending_orders: pendingOrders,
      salesLast5Days : salesLast5DaysFormatted,
      salesByCategory : salesByCategoryFormatted
      
    });
  } catch (error) {
    console.error("Error fetching today chart data:", error);
    return new Response(
      JSON.stringify({ message: "Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
