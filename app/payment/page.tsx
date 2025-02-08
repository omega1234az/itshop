"use client";
import { useEffect, useState } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { redirect } from "next/dist/server/api-utils";

const key = `${process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}`;
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
      const res = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: order
      });
      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(`API error: ${errorMessage}`);
      }

      const { sessionId } = await res.json() as CheckoutResponse;

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
      alert(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
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
    if(subtotal == 0){
        window.location.href = "/cart";
    }
    console.log(subtotal);
    setTotalPrice(subtotal);
  }, [cartItems]);

  return (
    <div className="flex flex-col items-center py-8 px-4 bg-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between max-w-6xl w-full gap-8">
        <div className="p-6 bg-white rounded-lg shadow-lg flex-1">
          <h1 className="text-3xl font-bold mb-4">ขอบคุณสำหรับคำสั่งซื้อ !!!</h1>
          <div className="mb-6 text-xl">
            <div className="flex mb-4">
              <h2 className="font-bold">ระยะเวลาจัดส่ง :</h2>
              <span> 3-5 วัน</span>
            </div>
            <div className="mb-6">
              <h2 className="font-bold">ที่อยู่:</h2>
              <p>{user?.name}</p>
              <p>{user?.phone}</p>
              <div className="flex justify-between items-center">
                <p>{user?.address}</p>
                <button className="text-teal-400 hover:text-teal-500">เปลี่ยน</button>
              </div>
            </div>
            <div className="text-lg">
              <h2 className="font-semibold">Need help?</h2>
              <button className="text-blue-400">Contact us</button>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-lg flex-1 max-w-md">
          <h1 className="font-bold text-2xl mb-4">รายการ :</h1>
          <div className="space-y-4">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.cart_id} className="flex gap-4 items-center border-b pb-4">
                  <img
                    src={`${item.product.img}`}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold">{item.product.name}</h2>
                    <p>{item.product.description}</p>
                    <div className="mt-2 text-sm font-medium">
                      <span>จำนวน: {item.quantity} ชิ้น</span>
                      <span className="ml-4">ราคา: {(item.product.price * item.quantity).toLocaleString()} บาท</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No items in the cart</p>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between text-xl">
              <span>ค่าสินค้า</span>
              <span>{totalPrice.toLocaleString()} บาท</span>
            </div>
            <div className="flex justify-between text-xl">
              <span>ค่าจัดส่ง</span>
              <span>ฟรี</span>
            </div>
            <div className="flex justify-between text-2xl font-bold">
              <span>รวมทั้งหมด</span>
              <span>{totalPrice.toLocaleString()} บาท</span>
            </div>
          </div>

          <button
            onClick={checkOut}
            disabled={isProcessing}
            className={`w-full mt-6 p-3 rounded-lg bg-teal-400 text-white font-bold hover:bg-teal-500 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isProcessing ? 'กำลังดำเนินการ...' : 'ชำระเงิน'}
          </button>
        </div>
      </div>
    </div>
  );
}
