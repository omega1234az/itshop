import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
    try {
        const body = await req.text();
        const head = await headers()
        const signature = head.get('stripe-signature');

        let event;
        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                webhookSecret
            );
        } catch (err) {
            console.error('⚠️ Webhook signature verification failed.', err.message);
            return NextResponse.json({ message: err.message }, { status: 400 });
        }
        const session = event.data.object;
        switch (event.type) {
            case 'checkout.session.completed':
                
                await handleCheckoutSessionCompleted(session);
                break;

            case 'checkout.session.expired':
                
                console.log('Payment failed:', session);
                await handleCheckoutSessionfailed(session);
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return NextResponse.json({ received: true });

    } catch (err) {
        console.error('❌ Error:', err);
        return NextResponse.json(
            { message: 'Something went wrong' },
            { status: 500 }
        );
    }
}

async function handleCheckoutSessionCompleted(session) {
    try {
        const urlParts = session.success_url.split('/');
        const transaction_id = urlParts[urlParts.length - 1];

        await prisma.$transaction(async (tx) => {
            // อัพเดตสถานะการชำระเงิน
            const payment = await tx.payments.update({
                where: { transaction_id },
                data: {
                    payment_status: 'completed',
                    payment_date: new Date(),
                },
                include: {
                    order: true,
                    user: true
                }
            });

            // อัพเดตสถานะ order
            await tx.orders.update({
                where: { order_id: payment.order.order_id },
                data: {
                    status: 'processing',
                    payment_status: 'completed',
                }
            });

            // อัพเดต total_spent ของ user
            await tx.users.update({
                where: { user_id: payment.user.user_id },
                data: {
                    total_spent: {
                        increment: payment.amount
                    }
                }
            }); 
            
            

            // Decrement stock for the products in the order
            const orderDetails = await tx.order_details.findMany({
                where: { order_id: payment.order.order_id }
            });

            // Decrease stock for each ordered product
            await Promise.all(orderDetails.map(detail =>
                tx.products.update({
                    where: { product_id: detail.product_id },
                    data: {
                        stock: { decrement: detail.quantity },
                        total_sales: { increment: detail.quantity },
                        total_revenue: { increment: detail.price * detail.quantity },
                    },
                })
            ));
        });

    } catch (error) {
        console.error('Failed to handle checkout session:', error);
        throw error;
    }
}




async function handleCheckoutSessionfailed(session) {
   
        
        const session_id = session.id;
        console.log('Transaction ID:', session_id);

        await prisma.$transaction(async (tx) => {
            const payment = await tx.payments.update({
                where: { session_id : session.id },
                data: {
                    payment_status: 'failed',
                },
                include: {
                    order: true,
                    user: true
                }
            });
            

            // อัพเดตสถานะ order เป็น failed
            await tx.orders.update({
                where: { order_id: payment.order.order_id },
                data: {
                    status: 'cancelled',
                    payment_status: 'failed',
                }
            });

            // คืน stock สินค้า
            const orderDetails = await tx.order_details.findMany({
                where: { order_id: payment.order.order_id }
            });

            await Promise.all(orderDetails.map(detail =>
                tx.products.update({
                    where: { product_id: detail.product_id },
                    data: {
                        stock: { increment: detail.quantity },
                        total_sales: { decrement: detail.quantity },
                        total_revenue: { decrement: detail.price * detail.quantity },
                    },
                })
            ));

            // กรณีที่มีการเพิ่ม total_spent ไปแล้วก็ต้องลดกลับ
            if (payment.order.payment_status === 'completed') {
                await tx.users.update({
                    where: { user_id: payment.user.user_id },
                    data: {
                        total_spent: { decrement: payment.amount }
                    }
                });
            }
        });

    
}