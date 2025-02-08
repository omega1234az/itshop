import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // ดึง Top 5 Categories ที่มี view_count สูงสุด
    const topCategories = await prisma.categories.findMany({
      orderBy: {
        view_count: "desc", // เรียงจากมากไปน้อย
      },
      take: 3, // เอาเฉพาะ 5 อันดับแรก
      include: {
        sub_categories: true, // รวม subcategories ด้วย
      },
    });

    return NextResponse.json(topCategories, { status: 200 });
  } catch (error) {
    console.error("Error fetching top categories:", error);
    return NextResponse.json(
      { message: "ไม่สามารถดึงข้อมูล Top Categories ได้", error: error.message },
      { status: 500 }
    );
  }
}
