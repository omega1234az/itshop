import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const name = await params.name;  
    console.log(name);
    if (!name) {
      return NextResponse.json({
        success: false,
        message: 'Search term is required'
      }, { status: 400 });
    }

    const products = await prisma.products.findMany({
      where: {
        OR: [
          {
            name: {
              contains: name,
              
            },
          },
          {
            description: {
              contains: name,
             
            },
          },
        ],
      },
      include: {
        category: true,
        sub_category: true,
      },
    });

    if (!products.length) {
      return NextResponse.json({
        success: false,
        message: 'No products found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}