import { subDays, startOfMonth, endOfMonth, eachDayOfInterval, format, getDay, getHours } from "date-fns";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const now = new Date();
    const firstDayOfMonth = startOfMonth(now);
    const lastDayOfMonth = endOfMonth(now);

    // ยอดขายรวมของเดือนนี้ (เฉพาะสถานะ processing และ completed)
    const totalSalesThisMonth = await prisma.orders.aggregate({
      _sum: { total_price: true },
      where: {
        order_date: { gte: firstDayOfMonth },
        status: { in: ["processing", "completed"] },
      },
    });

    // จำนวนออเดอร์ทั้งหมดในเดือนนี้
    const totalOrdersThisMonth = await prisma.orders.count({
      where: {
        order_date: { gte: firstDayOfMonth },
        status: { in: ["processing", "completed"] },
      },
    });

    // จำนวนผู้ใช้ใหม่ในเดือนนี้
    const newUsersThisMonth = await prisma.users.count({
      where: { created_at: { gte: firstDayOfMonth } },
    });

    // จำนวนออเดอร์ที่รอการดำเนินการ
    const pendingOrders = await prisma.orders.count({
      where: { status: { in: ["pending", "processing"] } },
    });

    // ดึงยอดขายทั้งหมดของเดือน
    const monthSales = await prisma.orders.findMany({
      where: {
        order_date: { gte: firstDayOfMonth, lte: lastDayOfMonth },
        status: { in: ["processing", "completed"] },
      },
      select: { order_date: true, total_price: true },
      orderBy: { order_date: "asc" },
    });

    // สร้างรายการวันที่ทั้งหมดของเดือน
    const allDaysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

    // จัดกลุ่มยอดขายตามวันที่
    const salesByDate = monthSales.reduce((acc, order) => {
      const date = format(order.order_date, 'yyyy-MM-dd');
      if (!acc[date]) acc[date] = { total_sales: 0 };
      acc[date].total_sales += order.total_price;
      return acc;
    }, {});

    // จัดรูปแบบข้อมูลยอดขายรายวัน
    const monthlySalesFormatted = allDaysInMonth.map(date => ({
      date: format(date, 'yyyy-MM-dd'),
      total_sales: salesByDate[format(date, 'yyyy-MM-dd')]?.total_sales || 0,
    }));

    // ดึงข้อมูลออเดอร์และหมวดหมู่สินค้า
    const orderDetails = await prisma.order_details.findMany({
      where: { order: { status: { in: ["processing", "completed"] } } },
      include: { product: { select: { category_id: true } } },
    });

    const categories = await prisma.categories.findMany();

    // จัดกลุ่มยอดขายตามหมวดหมู่สินค้า
    const salesByCategory = orderDetails.reduce((acc, orderDetail) => {
      const categoryId = orderDetail.product.category_id;
      if (!acc[categoryId]) acc[categoryId] = { total_sales: 0 };
      acc[categoryId].total_sales += orderDetail.price;
      return acc;
    }, {});

    const salesByCategoryFormatted = categories.map(category => ({
      category_id: category.category_id,
      category_name: category.name,
      total_sales: salesByCategory[category.category_id]?.total_sales || 0,
    }));

    // จัดกลุ่มยอดขายตามวันในสัปดาห์
    const salesByDayOfWeek = monthSales.reduce((acc, order) => {
      const day = getDay(order.order_date);
      if (!acc[day]) acc[day] = { total_sales: 0 };
      acc[day].total_sales += order.total_price;
      return acc;
    }, {});

    const salesByDayOfWeekFormatted = [
      { day: "Sunday", total_sales: salesByDayOfWeek[0] || 0 },
      { day: "Monday", total_sales: salesByDayOfWeek[1] || 0 },
      { day: "Tuesday", total_sales: salesByDayOfWeek[2] || 0 },
      { day: "Wednesday", total_sales: salesByDayOfWeek[3] || 0 },
      { day: "Thursday", total_sales: salesByDayOfWeek[4] || 0 },
      { day: "Friday", total_sales: salesByDayOfWeek[5] || 0 },
      { day: "Saturday", total_sales: salesByDayOfWeek[6] || 0 },
    ];

    // จัดกลุ่มยอดขายตามช่วงเวลา
    const salesByTimePeriod = monthSales.reduce((acc, order) => {
      const hour = getHours(order.order_date);
      let period = "Morning";
      if (hour >= 12 && hour < 18) period = "Afternoon";
      if (hour >= 18) period = "Evening";

      if (!acc[period]) acc[period] = { total_sales: 0 };
      acc[period].total_sales += order.total_price;
      return acc;
    }, {});

    const salesByTimePeriodFormatted = [
      { period: "Morning", total_sales: salesByTimePeriod["Morning"]?.total_sales || 0 },
      { period: "Afternoon", total_sales: salesByTimePeriod["Afternoon"]?.total_sales || 0 },
      { period: "Evening", total_sales: salesByTimePeriod["Evening"]?.total_sales || 0 },
    ];

    // คำนวณ Conversion Rate (จำนวนออเดอร์ / ผู้ใช้ใหม่)
    const conversionRate = totalOrdersThisMonth / (newUsersThisMonth || 1);

    return Response.json({
      total_sales_this_month: totalSalesThisMonth._sum.total_price || 0,
      total_orders_this_month: totalOrdersThisMonth,
      new_users_this_month: newUsersThisMonth,
      pending_orders: pendingOrders,
      monthly_sales: monthlySalesFormatted,
      salesByCategory: salesByCategoryFormatted,
      salesByDayOfWeek: salesByDayOfWeekFormatted,
      salesByTimePeriod: salesByTimePeriodFormatted,
      conversion_rate: conversionRate.toFixed(2),
    });

  } catch (error) {
    console.error("Error fetching monthly chart data:", error);
    return new Response(
      JSON.stringify({ message: "Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
