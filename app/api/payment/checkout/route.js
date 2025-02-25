import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

export async function POST(req) {
    try {
        // ตรวจสอบ request body
        if (!req.body) {
            return NextResponse.json({ 
                message: "Request body is empty" 
            }, { status: 400 });
        }

        const body = await req.json();
        if (!body) {
            return NextResponse.json({ 
                message: "Invalid JSON in request body" 
            }, { status: 400 });
        }

        const { user, products } = body;

        // ตรวจสอบข้อมูลที่จำเป็น
        if (!user?.user_id ) {
            return NextResponse.json({ 
                message: "Missing user information" 
            }, { status: 400 });
        }
        if (user.address === null) {
            return NextResponse.json({ 
                message: "Address" 
            }, { status: 400 });
        }

        if (!products || !Array.isArray(products) || products.length === 0) {
            return NextResponse.json({ 
                message: "Invalid or empty products array" 
            }, { status: 400 });
        }

        // ตรวจสอบข้อมูลของแต่ละสินค้า
        for (const product of products) {
            if (!product.product_id || !product.quantity) {
                return NextResponse.json({ 
                    message: "Invalid product data", 
                    product 
                }, { status: 400 });
            }
        }

        // ดึงข้อมูลสินค้าจากฐานข้อมูล
        const productIds = products.map(p => p.product_id);
        const dbProducts = await prisma.products.findMany({
            where: {
                product_id: { in: productIds }
            }
        });

        // ตรวจสอบว่าพบสินค้าทั้งหมดหรือไม่
        if (dbProducts.length !== products.length) {
            return NextResponse.json({ 
                message: "Some products not found" 
            }, { status: 400 });
        }

        // สร้าง map ของ quantity ที่ต้องการซื้อ
        const quantityMap = products.reduce((map, p) => {
            map[p.product_id] = p.quantity;
            return map;
        }, {});

        // ตรวจสอบ stock และสร้างข้อมูลสำหรับคำนวณ
        const productsWithQuantity = dbProducts.map(p => {
            const orderQuantity = quantityMap[p.product_id];
            if (p.stock < orderQuantity) {
                throw new Error(`สินค้า ${p.name} มีไม่เพียงพอ (ต้องการ ${orderQuantity}, มี ${p.stock})`);
            }
            return {
                ...p,
                quantity: orderQuantity
            };
        });

        const transaction_id = randomUUID();

        // คำนวณราคารวม
        const total_order_price = productsWithQuantity.reduce((sum, product) => 
            sum + (product.price * product.quantity), 0);

        // สร้าง line_items สำหรับ Stripe
        const line_items = productsWithQuantity.map(product => ({
            price_data: {
                currency: 'thb',
                product_data: {
                    name: product.name,
                },
                unit_amount: Math.round(product.price * 100),
            },
            quantity: product.quantity,
        }));

        // สร้าง Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            
            line_items,
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success/${transaction_id}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel/${transaction_id}`,
            metadata: {transaction_id : transaction_id},
            expires_at: Math.floor(Date.now() / 1000) + 60 * 30,
        });

        // Begin transaction
        const order = await prisma.$transaction(async (tx) => {
            // สร้าง order
            const newOrder = await tx.orders.create({
                data: {
                    user_id: user.user_id,
                    total_price: total_order_price,
                    total_order_price: total_order_price,
                    status: 'pending',
                    payment_status: 'pending',
                    address: user.address || 'Error: Address not provided',
                    order_details: {
                        create: productsWithQuantity.map(product => ({
                            product_id: product.product_id,
                            quantity: product.quantity,
                            price: product.price,
                        })),
                    },
                    payments: {
                        create: {
                            user_id: user.user_id,
                            payment_method: 'stripe',
                            payment_status: 'pending',
                            transaction_id,
                            session_id: session.id,
                            amount: total_order_price,
                        },
                    },
                },
                include: {
                    order_details: true,
                    payments: true,
                },
            });
            await tx.cart.deleteMany({
                where: { user_id: user.user_id } // ใช้ user.user_id ที่รับเข้ามาจาก request
            });
            
            
            

            
            

            return newOrder;
        });
        console.log(session);
        return NextResponse.json({
            sessionId: session.id,
            transaction_id,
            order_id: order.order_id,
            total_price: total_order_price,
        }, { status: 200 });

    } catch (err) {
        console.error("❌ Error:", err);
        return NextResponse.json({ 
            message: err.message || "เกิดข้อผิดพลาดในการสร้าง Checkout Session หรือบันทึก Order",
            error: process.env.NODE_ENV === 'development' ? err.toString() : undefined
        }, { status: 500 });
    }
}