import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    // ดึง query parameter สำหรับกรองข้อมูล (ถ้ามี)
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all'; // all, day, week, month, year

    // ฟังก์ชันดึงข้อมูลรายได้รายวัน
    const getDailyRevenue = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // ดึงข้อมูลคำสั่งซื้อที่เสร็จสมบูรณ์ของวันนี้
      const orders = await prisma.order_details.findMany({
        where: {
          order: {
            order_date: {
              gte: today
            },
            status: "completed",
            payment_status: "completed"
          }
        },
        include: {
          order: true,
          product: {
            include: {
              category: true
            }
          }
        }
      });

      // สร้างช่วงเวลาสำหรับวันนี้ (แบ่งเป็น 6 ช่วง ทุก 4 ชั่วโมง)
      const timeSlots = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
      
      // จัดกลุ่มคำสั่งซื้อตามช่วงเวลา
      const groupedOrders = orders.reduce((acc, orderDetail) => {
        const orderHour = new Date(orderDetail.order.order_date).getHours();
        const slotIndex = Math.floor(orderHour / 4);
        const slotName = timeSlots[slotIndex];
        
        if (!acc[slotName]) {
          acc[slotName] = {
            GPU: 0,
            CPU: 0,
            RAM: 0,
            SSD: 0,
            Mainboard: 0,
            Case: 0
          };
        }
        
        // หาหมวดหมู่ของสินค้า
        let category = 'อื่นๆ';
        if (orderDetail.product?.category) {
          category = orderDetail.product.category.name;
        }
        
        // แปลงชื่อหมวดหมู่ให้ตรงกับที่เราต้องการแสดง
        let mappedCategory;
        switch(category.toLowerCase()) {
          case 'กราฟิกการ์ด':
          case 'การ์ดจอ': 
          case 'graphic card':
          case 'VGA':
            mappedCategory = 'GPU';
            break;
          case 'โปรเซสเซอร์':
          case 'ซีพียู':
          case 'processor':
          case 'cpu':
            mappedCategory = 'CPU';
            break;
          case 'หน่วยความจำ':
          case 'แรม':
          case 'memory':
          case 'ram':
            mappedCategory = 'RAM';
            break;
          case 'ฮาร์ดดิสก์':
          case 'เอสเอสดี':
          case 'hard disk':
          case 'ssd':
            mappedCategory = 'SSD';
            break;
          case 'เมนบอร์ด':
          case 'แผงวงจรหลัก':
          case 'motherboard':
          case 'mainboard':
            mappedCategory = 'Mainboard';
            break;
          case 'เคส':
          case 'คอมพิวเตอร์เคส':
          case 'case':
            mappedCategory = 'Case';
            break;
          default:
            // ถ้าไม่ใช่หมวดหมู่ที่เราสนใจ ข้ามไป
            return acc;
        }

        // คำนวณรายได้จากรายการสั่งซื้อนี้
        const revenue = orderDetail.price * orderDetail.quantity;
        
        // เพิ่มรายได้ให้หมวดหมู่ที่เหมาะสม
        if (acc[slotName][mappedCategory] !== undefined) {
          acc[slotName][mappedCategory] += revenue;
        }
        
        return acc;
      }, {});
      
      // แปลงข้อมูลให้อยู่ในรูปแบบที่ต้องการ
      return timeSlots.map(slot => {
        return {
          name: slot,
          GPU: groupedOrders[slot]?.GPU || 0,
          CPU: groupedOrders[slot]?.CPU || 0,
          RAM: groupedOrders[slot]?.RAM || 0,
          SSD: groupedOrders[slot]?.SSD || 0,
          Mainboard: groupedOrders[slot]?.Mainboard || 0,
          Case: groupedOrders[slot]?.Case || 0
        };
      });
    };

    // ฟังก์ชันดึงข้อมูลรายได้รายสัปดาห์
    const getWeeklyRevenue = async () => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      weekAgo.setHours(0, 0, 0, 0);
      
      // ดึงข้อมูลคำสั่งซื้อที่เสร็จสมบูรณ์ของสัปดาห์นี้
      const orders = await prisma.order_details.findMany({
        where: {
          order: {
            order_date: {
              gte: weekAgo
            },
            status: "completed",
            payment_status: "completed"
          }
        },
        include: {
          order: true,
          product: {
            include: {
              category: true
            }
          }
        }
      });

      // สร้างวันสำหรับแต่ละวันในสัปดาห์
      const days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        return {
          date,
          label: date.toLocaleDateString('th-TH', { weekday: 'short' })
        };
      }).reverse();
      
      // จัดกลุ่มคำสั่งซื้อตามวัน
      const groupedOrders = orders.reduce((acc, orderDetail) => {
        const orderDate = new Date(orderDetail.order.order_date);
        orderDate.setHours(0, 0, 0, 0);
        
        // หาวันที่ตรงกัน
        const dayLabel = days.find(d => d.date.getTime() === orderDate.getTime())?.label;
        
        if (!dayLabel) return acc;
        
        if (!acc[dayLabel]) {
          acc[dayLabel] = {
            GPU: 0,
            CPU: 0,
            RAM: 0,
            SSD: 0,
            Mainboard: 0,
            Case: 0
          };
        }
        
        // หาหมวดหมู่ของสินค้า
        let category = 'อื่นๆ';
        if (orderDetail.product?.category) {
          category = orderDetail.product.category.name;
        }
        
        // แปลงชื่อหมวดหมู่
        let mappedCategory;
        switch(category.toLowerCase()) {
          case 'กราฟิกการ์ด':
          case 'การ์ดจอ': 
          case 'graphic card':
            mappedCategory = 'GPU';
            break;
          case 'โปรเซสเซอร์':
          case 'ซีพียู':
          case 'processor':
          case 'cpu':
            mappedCategory = 'CPU';
            break;
          case 'หน่วยความจำ':
          case 'แรม':
          case 'memory':
          case 'ram':
            mappedCategory = 'RAM';
            break;
          case 'ฮาร์ดดิสก์':
          case 'เอสเอสดี':
          case 'hard disk':
          case 'ssd':
            mappedCategory = 'SSD';
            break;
          case 'เมนบอร์ด':
          case 'แผงวงจรหลัก':
          case 'motherboard':
          case 'mainboard':
            mappedCategory = 'Mainboard';
            break;
          case 'เคส':
          case 'คอมพิวเตอร์เคส':
          case 'case':
            mappedCategory = 'Case';
            break;
          default:
            // ถ้าไม่ใช่หมวดหมู่ที่เราสนใจ ข้ามไป
            return acc;
        }

        // คำนวณรายได้
        const revenue = orderDetail.price * orderDetail.quantity;
        
        // เพิ่มรายได้ให้หมวดหมู่ที่เหมาะสม
        if (acc[dayLabel][mappedCategory] !== undefined) {
          acc[dayLabel][mappedCategory] += revenue;
        }
        
        return acc;
      }, {});
      
      // แปลงข้อมูลให้อยู่ในรูปแบบที่ต้องการ
      return days.map(day => {
        return {
          name: day.label,
          GPU: groupedOrders[day.label]?.GPU || 0,
          CPU: groupedOrders[day.label]?.CPU || 0,
          RAM: groupedOrders[day.label]?.RAM || 0,
          SSD: groupedOrders[day.label]?.SSD || 0,
          Mainboard: groupedOrders[day.label]?.Mainboard || 0,
          Case: groupedOrders[day.label]?.Case || 0
        };
      });
    };

    // ฟังก์ชันดึงข้อมูลรายได้รายเดือน
    const getMonthlyRevenue = async () => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      monthAgo.setHours(0, 0, 0, 0);
      
      // ดึงข้อมูลคำสั่งซื้อที่เสร็จสมบูรณ์ของเดือนนี้
      const orders = await prisma.order_details.findMany({
        where: {
          order: {
            order_date: {
              gte: monthAgo
            },
            status: "completed",
            payment_status: "completed"
          }
        },
        include: {
          order: true,
          product: {
            include: {
              category: true
            }
          }
        }
      });

      // สร้างสัปดาห์สำหรับเดือนนี้ (4 สัปดาห์)
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const weeksInMonth = [];
      
      for (let i = 0; i < 4; i++) {
        const weekStart = new Date(firstDayOfMonth);
        weekStart.setDate(1 + (i * 7));
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        weeksInMonth.push({
          label: `สัปดาห์ที่ ${i + 1}`,
          start: weekStart,
          end: weekEnd
        });
      }
      
      // จัดกลุ่มคำสั่งซื้อตามสัปดาห์
      const groupedOrders = orders.reduce((acc, orderDetail) => {
        const orderDate = new Date(orderDetail.order.order_date);
        
        // หาสัปดาห์ที่ตรงกัน
        const week = weeksInMonth.find(w => 
          orderDate >= w.start && orderDate <= w.end
        );
        
        if (!week) return acc;
        
        if (!acc[week.label]) {
          acc[week.label] = {
            GPU: 0,
            CPU: 0,
            RAM: 0,
            SSD: 0,
            Mainboard: 0,
            Case: 0
          };
        }
        
        // หาหมวดหมู่ของสินค้า
        let category = 'อื่นๆ';
        if (orderDetail.product?.category) {
          category = orderDetail.product.category.name;
        }
        
        // แปลงชื่อหมวดหมู่
        let mappedCategory;
        switch(category.toLowerCase()) {
          case 'กราฟิกการ์ด':
          case 'การ์ดจอ': 
          case 'graphic card':
            mappedCategory = 'GPU';
            break;
          case 'โปรเซสเซอร์':
          case 'ซีพียู':
          case 'processor':
          case 'cpu':
            mappedCategory = 'CPU';
            break;
          case 'หน่วยความจำ':
          case 'แรม':
          case 'memory':
          case 'ram':
            mappedCategory = 'RAM';
            break;
          case 'ฮาร์ดดิสก์':
          case 'เอสเอสดี':
          case 'hard disk':
          case 'ssd':
            mappedCategory = 'SSD';
            break;
          case 'เมนบอร์ด':
          case 'แผงวงจรหลัก':
          case 'motherboard':
          case 'mainboard':
            mappedCategory = 'Mainboard';
            break;
          case 'เคส':
          case 'คอมพิวเตอร์เคส':
          case 'case':
            mappedCategory = 'Case';
            break;
          default:
            // ถ้าไม่ใช่หมวดหมู่ที่เราสนใจ ข้ามไป
            return acc;
        }

        // คำนวณรายได้
        const revenue = orderDetail.price * orderDetail.quantity;
        
        // เพิ่มรายได้ให้หมวดหมู่ที่เหมาะสม
        if (acc[week.label][mappedCategory] !== undefined) {
          acc[week.label][mappedCategory] += revenue;
        }
        
        return acc;
      }, {});
      
      // แปลงข้อมูลให้อยู่ในรูปแบบที่ต้องการ
      return weeksInMonth.map(week => {
        return {
          name: week.label,
          GPU: groupedOrders[week.label]?.GPU || 0,
          CPU: groupedOrders[week.label]?.CPU || 0,
          RAM: groupedOrders[week.label]?.RAM || 0,
          SSD: groupedOrders[week.label]?.SSD || 0,
          Mainboard: groupedOrders[week.label]?.Mainboard || 0,
          Case: groupedOrders[week.label]?.Case || 0
        };
      });
    };

    // ฟังก์ชันดึงข้อมูลรายได้รายปี
    const getYearlyRevenue = async () => {
      const yearAgo = new Date();
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      yearAgo.setHours(0, 0, 0, 0);
      
      // ดึงข้อมูลคำสั่งซื้อที่เสร็จสมบูรณ์ของปีนี้
      const orders = await prisma.order_details.findMany({
        where: {
          order: {
            order_date: {
              gte: yearAgo
            },
            status: "completed",
            payment_status: "completed"
          }
        },
        include: {
          order: true,
          product: {
            include: {
              category: true
            }
          }
        }
      });

      // เดือนในภาษาไทย
      const thaiMonths = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
      ];
      
      // สร้างข้อมูลสำหรับแต่ละเดือนในปี
      const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (11 - i));
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        return {
          month: date.getMonth(),
          year: date.getFullYear(),
          label: thaiMonths[date.getMonth()],
          date
        };
      });
      
      // จัดกลุ่มคำสั่งซื้อตามเดือน
      const groupedOrders = orders.reduce((acc, orderDetail) => {
        const orderDate = new Date(orderDetail.order.order_date);
        
        // หาเดือนที่ตรงกัน
        const month = months.find(m => 
          m.month === orderDate.getMonth() && m.year === orderDate.getFullYear()
        );
        
        if (!month) return acc;
        
        if (!acc[month.label]) {
          acc[month.label] = {
            GPU: 0,
            CPU: 0,
            RAM: 0,
            SSD: 0,
            Mainboard: 0,
            Case: 0
          };
        }
        
        // หาหมวดหมู่ของสินค้า
        let category = 'อื่นๆ';
        if (orderDetail.product?.category) {
          category = orderDetail.product.category.name;
        }
        
        // แปลงชื่อหมวดหมู่
        let mappedCategory;
        switch(category.toLowerCase()) {
          case 'กราฟิกการ์ด':
          case 'การ์ดจอ': 
          case 'graphic card':
            mappedCategory = 'GPU';
            break;
          case 'โปรเซสเซอร์':
          case 'ซีพียู':
          case 'processor':
          case 'cpu':
            mappedCategory = 'CPU';
            break;
          case 'หน่วยความจำ':
          case 'แรม':
          case 'memory':
          case 'ram':
            mappedCategory = 'RAM';
            break;
          case 'ฮาร์ดดิสก์':
          case 'เอสเอสดี':
          case 'hard disk':
          case 'ssd':
            mappedCategory = 'SSD';
            break;
          case 'เมนบอร์ด':
          case 'แผงวงจรหลัก':
          case 'motherboard':
          case 'mainboard':
            mappedCategory = 'Mainboard';
            break;
          case 'เคส':
          case 'คอมพิวเตอร์เคส':
          case 'case':
            mappedCategory = 'Case';
            break;
          default:
            // ถ้าไม่ใช่หมวดหมู่ที่เราสนใจ ข้ามไป
            return acc;
        }

        // คำนวณรายได้
        const revenue = orderDetail.price * orderDetail.quantity;
        
        // เพิ่มรายได้ให้หมวดหมู่ที่เหมาะสม
        if (acc[month.label][mappedCategory] !== undefined) {
          acc[month.label][mappedCategory] += revenue;
        }
        
        return acc;
      }, {});
      
      // แปลงข้อมูลให้อยู่ในรูปแบบที่ต้องการ
      return months.map(month => {
        return {
          name: month.label,
          GPU: groupedOrders[month.label]?.GPU || 0,
          CPU: groupedOrders[month.label]?.CPU || 0,
          RAM: groupedOrders[month.label]?.RAM || 0,
          SSD: groupedOrders[month.label]?.SSD || 0,
          Mainboard: groupedOrders[month.label]?.Mainboard || 0,
          Case: groupedOrders[month.label]?.Case || 0
        };
      });
    };

    // สร้าง dashboard คำสั่งซื้อล่าสุด
    const getRecentOrders = async () => {
      return await prisma.orders.findMany({
        take: 5,
        orderBy: {
          order_date: 'desc'
        },
        include: {
          user: true,
          order_details: {
            include: {
              product: true
            }
          }
        }
      });
    };

    // สร้าง dashboard สรุปข้อมูล
    const getSummary = async () => {
      // จำนวนคำสั่งซื้อทั้งหมด
      const orderCount = await prisma.orders.count();
      
      // ยอดขายรวมทั้งหมด
      const totalSales = await prisma.orders.aggregate({
        _sum: {
          total_price: true
        },
        where: {
          status: "completed",
          payment_status: "completed"
        }
      });
      
      // จำนวนลูกค้าทั้งหมด
      const customerCount = await prisma.users.count({
        where: {
          role: "customer"
        }
      });
      
      // สินค้าที่ขายดีที่สุด
      const topProducts = await prisma.products.findMany({
        take: 5,
        orderBy: {
          total_sales: 'desc'
        },
        include: {
          category: true
        }
      });
      
      return {
        orderCount,
        totalSales: totalSales._sum.total_price || 0,
        customerCount,
        topProducts
      };
    };

    // ดึงข้อมูลตามช่วงเวลาที่ต้องการ
    let result = {};

    if (period === 'all' || period === 'day') {
      result['1วัน'] = await getDailyRevenue();
    }
    
    if (period === 'all' || period === 'week') {
      result['1อาทิตย์'] = await getWeeklyRevenue();
    }
    
    if (period === 'all' || period === 'month') {
      result['1เดือน'] = await getMonthlyRevenue();
    }
    
    if (period === 'all' || period === 'year') {
      result['1ปี'] = await getYearlyRevenue();
    }

    // ถ้าเรียกดูทุกช่วงเวลา เพิ่มข้อมูลเพิ่มเติม
    if (period === 'all') {
      const summary = await getSummary();
      const recentOrders = await getRecentOrders();
      
      return NextResponse.json({ 
        รายได้: result,
        สรุป: summary,
        คำสั่งซื้อล่าสุด: recentOrders
      }, { status: 200 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลรายได้', detail: error.message },
      { status: 500 }
    );
  }
}