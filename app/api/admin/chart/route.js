import { subDays, startOfMonth, endOfMonth, eachDayOfInterval, format } from "date-fns";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const now = new Date();
    const firstDayOfMonth = startOfMonth(now);
    const lastDayOfMonth = endOfMonth(now);
    const fiveDaysAgo = subDays(now, 30);

    const totalSalesThisMonth = await prisma.orders.aggregate({
      _sum: { total_price: true },
      where: {
        order_date: { gte: firstDayOfMonth },
        status: "completed",
      },
    });

    const totalOrdersThisMonth = await prisma.orders.count({
      where: {
        order_date: { gte: firstDayOfMonth },
      },
    });

    const newUsersThisMonth = await prisma.users.count({
      where: {
        created_at: { gte: firstDayOfMonth },
      },
    });

    const pendingOrders = await prisma.orders.count({
      where: {
        status: "processing",
      },
    });

    // Get all sales for the current month
    const monthSales = await prisma.orders.findMany({
      where: {
        order_date: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
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

    // Generate all days in the current month
    const allDaysInMonth = eachDayOfInterval({
      start: firstDayOfMonth,
      end: lastDayOfMonth,
    });

    // Create a map of sales by date
    const salesByDate = monthSales.reduce((acc, order) => {
      const date = format(order.order_date, 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = { total_sales: 0 };
      }
      acc[date].total_sales += order.total_price;
      return acc;
    }, {});

    // Format the data with all days, using 0 for days without sales
    const monthlySalesFormatted = allDaysInMonth.map(date => ({
      date: format(date, 'yyyy-MM-dd'),
      total_sales: salesByDate[format(date, 'yyyy-MM-dd')]?.total_sales || 0,
    }));

    // Get sales by category
    const orderDetails = await prisma.order_details.findMany({
      include: {
        product: {
          select: {
            category_id: true,
          },
        },
      },
    });

    const categories = await prisma.categories.findMany();

    const salesByCategory = orderDetails.reduce((acc, orderDetail) => {
      const categoryId = orderDetail.product.category_id;
      if (!acc[categoryId]) {
        acc[categoryId] = { total_sales: 0 };
      }
      acc[categoryId].total_sales += orderDetail.price;
      return acc;
    }, {});

    const salesByCategoryFormatted = categories.map(category => ({
      category_id: category.category_id,
      category_name: category.name,
      total_sales: salesByCategory[category.category_id]?.total_sales || 0,
    }));

    return Response.json({
      total_sales_this_month: totalSalesThisMonth._sum.total_price || 0,
      total_orders_this_month: totalOrdersThisMonth,
      new_users_this_month: newUsersThisMonth,
      pending_orders: pendingOrders,
      monthly_sales: monthlySalesFormatted,
      salesByCategory: salesByCategoryFormatted
    });
  } catch (error) {
    console.error("Error fetching monthly chart data:", error);
    return new Response(
      JSON.stringify({ message: "Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}