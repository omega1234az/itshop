"use client";
import { useEffect, useState } from "react";
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe outside of the component
const key = `${process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}`;
console.log(key);
const stripePromise = loadStripe(key);

interface User {
    user_id: number;
    name: string;
    email: string;
    address: string;
    img: string;
    phone: string;
}

interface Product {
    product_id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    img: string;
}

interface CartItem {
    cart_id: number;
    user_id: number;
    product_id: number;
    quantity: number;
    product: Product;
}

interface CheckoutResponse {
    sessionId: string;
}

export default function Payment() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [user, setUser] = useState<User | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    async function checkOut() {
        if (isProcessing) return;
        setIsProcessing(true);
    
        try {
            const products = cartItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity
            }));
            const order = JSON.stringify({
                user: {
                    user_id: user?.user_id,
                    address: user?.address
                },
                products: products
            });
            console.log(order);
            const res = await fetch("/api/payment/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: order
            });
            // ตรวจสอบว่า response มาจาก API ถูกต้องหรือไม่
            if (!res.ok) {
                const errorMessage = await res.text();
                throw new Error(`API error: ${errorMessage}`);
            }
    
            const { sessionId } = await res.json() as CheckoutResponse;
    
            // ตรวจสอบว่า sessionId มีค่าหรือไม่
            if (!sessionId) {
                alert("เกิดข้อผิดพลาดในการสร้าง session");
                setIsProcessing(false);
                return;
            }
    
            const stripe = await stripePromise;
            if (!stripe) {
                alert("Stripe failed to load");
                setIsProcessing(false);
                return;
            }
    
            await stripe.redirectToCheckout({
                sessionId: sessionId
            });
        } catch (error) {
            console.error("Checkout error:", error);
            if (error instanceof Error) {
                alert(`Error: ${error.message}`); // เพิ่มข้อความเตือนให้ผู้ใช้เห็น
            } else {
                alert('An unknown error occurred');
            }
            setIsProcessing(false);
        }
    }
    
    

    const cartItem = async () => {
        try {
            const res = await fetch("/api/cart", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Failed to fetch cart data");
            }

            const data = await res.json();
            setCartItems(data);
        } catch (error) {
            console.error("Error fetching cart items:", error);
            window.location.href = "/login";
        }
    };

    async function fetchUser() {
        try {
            const res = await fetch("/api/auth/me", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (res.status === 401 || res.status === 403) {
                console.log("User not authenticated");
                window.location.href = "/login";
                return;
            }

            if (!res.ok) throw new Error("Failed to fetch");

            const data = await res.json();
            setUser(data);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    }

    useEffect(() => {
        fetchUser();
        cartItem();
    }, []);

    useEffect(() => {
        const subtotal = cartItems.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
        setTotalPrice(subtotal);
    }, [cartItems]);

    return (
        <>
            <div className="flex flex-col">
                <div className="flex-1 flex flex-row justify-between mx-auto mt-10">
                    <div className="p-5 w-[850px] h-[650px] bg-gray-300">
                        <h1 className="text-4xl font-bold mb-20">ขอบคุณสำหรับคำสั่งซื้อ !!!</h1>
                        <div className="flex">
                            <div className="mr-auto">
                                <div className="flex mb-5 text-2xl">
                                    <h1 className="font-bold">ระยะเวลาจัดส่ง : </h1>
                                    <h2> 3-5 วัน</h2>
                                </div>
                            </div>
                            <div className="mb-10">
                                <h1 className="text-xl font-bold">ที่อยู่</h1>
                                <h1 className="text-xl font-bold">{user?.name}</h1>
                                <h1 className="text-xl ">{user?.phone}</h1>
                                <div className="flex mb-36  text-2xl">
                                    
                                    <h1>{user?.address}</h1>
                                    <button className="bg-teal-400 hover:bg-teal-500 rounded-lg p-1 ml-20 ">
                                        เปลี่ยน
                                    </button>
                                </div>
                                <div className="mb-3 text-2xl">
                                    <h1>Need help?</h1>
                                    <button className="text-blue-400">Contact us</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="ml-36 p-5 w-[500px] bg-gray-300">
                        <h1 className="font-bold text-3xl">รายการ :</h1>
                        <div className="grid grid-cols-1 gap-6">
                            {cartItems.length > 0 ? (
                                cartItems.map((item) => (
                                    <div key={item.cart_id} className="grid grid-cols-5 gap-4 p-4 bg-white rounded-lg shadow-lg">
                                        <img
                                            src={`/product/${item.product.img}`}
                                            alt={item.product.name}
                                            className="col-span-1 w-20 h-20 object-cover"
                                        />
                                        <div className="col-span-3 flex flex-col justify-center">
                                            <h2 className="text-xl font-bold">{item.product.name}</h2>
                                            <p>{item.product.description}</p>
                                            <div className="flex mt-2 text-md font-semibold">
                                                <span>จำนวน : {item.quantity} ชิ้น</span>
                                                <span className="ml-5">
                                                    ราคา: {(item.product.price * item.quantity).toLocaleString()} บาท
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No items in the cart</p>
                            )}
                        </div>

                        <div className="flex mt-10 mb-5">
                            <h1 className="text-xl font-bold mr-auto">ค่าสินค้า</h1>
                            <h1 className="text-lg font-bold">{totalPrice.toLocaleString()} บาท</h1>
                        </div>

                        <div className="flex mb-16">
                            <h1 className="text-xl font-bold mr-auto">ค่าจัดส่ง</h1>
                            <h1>ฟรี</h1>
                        </div>

                        <div className="flex">
                            <h1 className="text-xl font-bold mr-auto">รวมทั้งหมด</h1>
                            <h1 className="text-lg font-bold">{totalPrice.toLocaleString()} บาท</h1>
                        </div>

                        <button
                            onClick={checkOut}
                            disabled={isProcessing}
                            className={`bg-teal-400 hover:bg-teal-500 rounded-lg p-3 font-bold text-black w-full mt-5 
                                ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isProcessing ? 'กำลังดำเนินการ...' : 'ชำระเงิน'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}