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
        const signature = headers().get('stripe-signature');

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

        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                await handleCheckoutSessionCompleted(session);
                break;

            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                await handlePaymentIntentSucceeded(paymentIntent);
                break;

            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object;
                await handlePaymentIntentFailed(failedPayment);
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

            // หัก stock จากสินค้า
            const orderDetails = await tx.order_details.findMany({
                where: { order_id: payment.order.order_id }
            });

            await Promise.all(orderDetails.map(detail =>
                tx.products.update({
                    where: { product_id: detail.product_id },
                    data: {
                        stock: { decrement: detail.quantity }, // หักจำนวน stock
                        total_sales: { increment: detail.quantity }, // เพิ่มยอดขาย
                        total_revenue: { increment: detail.price * detail.quantity }, // เพิ่มรายได้
                    },
                })
            ));

            // อัพเดต total_spent ของ user
            await tx.users.update({
                where: { user_id: payment.user.user_id },
                data: {
                    total_spent: {
                        increment: payment.amount
                    }
                }
            });
            
            await tx.cart.deleteMany({
                where: { user_id: payment.user.user_id }
            });

        });
    } catch (error) {
        console.error('Failed to handle checkout session:', error);
        throw error;
    }
}



async function handlePaymentIntentSucceeded(paymentIntent) {
    try {
        const transaction_id = paymentIntent.metadata.transaction_id;
        if (!transaction_id) {
            console.error('No transaction_id found in payment intent metadata');
            return;
        }

        await prisma.$transaction(async (tx) => {
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

            await tx.orders.update({
                where: { order_id: payment.order.order_id },
                data: {
                    status: 'processing',
                    payment_status: 'completed',
                }
            });

            // หัก stock จากสินค้า
            const orderDetails = await tx.order_details.findMany({
                where: { order_id: payment.order.order_id }
            });

            await Promise.all(orderDetails.map(detail =>
                tx.products.update({
                    where: { product_id: detail.product_id },
                    data: {
                        stock: { decrement: detail.quantity }, // หักจำนวน stock
                        total_sales: { increment: detail.quantity }, // เพิ่มยอดขาย
                        total_revenue: { increment: detail.price * detail.quantity }, // เพิ่มรายได้
                    },
                })
            ));

            // อัพเดต total_spent ของ user
            await tx.users.update({
                where: { user_id: payment.user.user_id },
                data: {
                    total_spent: {
                        increment: payment.amount
                    }
                }
            });
        });

    } catch (error) {
        console.error('Failed to handle payment intent:', error);
        throw error;
    }
}


async function handlePaymentIntentFailed(paymentIntent) {
    try {
        const transaction_id = paymentIntent.metadata.transaction_id;
        if (!transaction_id) {
            console.error('No transaction_id found in payment intent metadata');
            return;
        }

        await prisma.$transaction(async (tx) => {
            const payment = await tx.payments.update({
                where: { transaction_id },
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
                    status: 'failed',
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

    } catch (error) {
        console.error('Failed to handle failed payment:', error);
        throw error;
    }
}