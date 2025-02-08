"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface CartItem {
    cart_id: number;
    user_id: number;
    product_id: number;
    quantity: number;
    product: Product;
    out_of_stock: boolean;
}

interface Product {
    product_id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    img: string;
}

export default function Cart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [isUpdating, setIsUpdating] = useState<{ [key: number]: boolean }>({});
    const [lastUpdateTime, setLastUpdateTime] = useState<{ [key: number]: number }>({});

    // Original functions remain the same
    const deleteCartItem = async (cart_id: number) => {
        if (isUpdating[cart_id]) return;
        
        setIsUpdating(prev => ({ ...prev, [cart_id]: true }));
        
        try {
            const res = await fetch(`/api/cart/${cart_id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error deleting item");

            Swal.fire({
                icon: 'success',
                title: 'ลบสินค้าออกจากตะกร้าเรียบร้อย',
                text: 'สินค้าถูกลบจากตะกร้าแล้ว',
                confirmButtonText: 'ตกลง',
            });
            setCartItems(cartItems.filter((item) => item.cart_id !== cart_id));
        } catch (error) {
            console.error("Error deleting cart item:", error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถลบสินค้าจากตะกร้าได้',
                confirmButtonText: 'ตกลง',
            });
        } finally {
            setIsUpdating(prev => ({ ...prev, [cart_id]: false }));
        }
    };

    const updateCartItemQuantity = async (cart_id: number, quantity: number) => {
        const now = Date.now();
        const lastUpdate = lastUpdateTime[cart_id] || 0;
        const timeDiff = now - lastUpdate;
        
        if (timeDiff < 500 || isUpdating[cart_id]) return;
        
        setIsUpdating(prev => ({ ...prev, [cart_id]: true }));
        setLastUpdateTime(prev => ({ ...prev, [cart_id]: now }));

        try {
            const res = await fetch(`/api/cart`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ cart_id, quantity }),
                credentials: "include",
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error updating item quantity");

            setCartItems(cartItems.map((item) => 
                item.cart_id === cart_id ? { ...item, quantity } : item
            ));
        } catch (error) {
            console.error("Error updating cart item:", error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถอัปเดตจำนวนสินค้าได้',
                confirmButtonText: 'ตกลง',
            });
        } finally {
            setIsUpdating(prev => ({ ...prev, [cart_id]: false }));
        }
    };

    const fetchCartItems = async () => {
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

            if (data.message === "No items found in cart") {
                setCartItems([]);
                return;
            }

            setCartItems(data);
        } catch (error) {
            console.error("Error fetching cart items:", error);
            window.location.href = "/login";
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    useEffect(() => {
        const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
        const quantity = cartItems.reduce((total, item) => total + item.quantity, 0);
        setTotalPrice(subtotal);
        setTotalQuantity(quantity);
    }, [cartItems]);

    return (
        <div className="container mx-auto px-4 lg:px-0">
            {/* Order Summary for Mobile - Fixed at Bottom */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t p-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">รวมทั้งหมด: {totalPrice.toLocaleString()}.-</span>
                    <a href="/payment">
                        <button 
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
                            disabled={cartItems.length === 0}
                        >
                            สั่งซื้อ
                        </button>
                    </a>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:grid lg:grid-cols-3 gap-5 mt-5 pb-20 lg:pb-0">
                {/* Cart Items */}
                <div className="lg:col-span-2 mb-6 lg:mb-0">
                    <h2 className="text-lg font-bold mb-3">ตะกร้าสินค้า</h2>
                    <div className="border-b-2 border-black mb-3"></div>
                    
                    {cartItems.length > 0 ? (
                        <div className="space-y-3">
                            {cartItems.map((item) => (
                                <div
                                    key={item.cart_id}
                                    className={`flex flex-col sm:flex-row items-center border p-4 rounded-lg shadow-md ${
                                        isUpdating[item.cart_id] ? 'opacity-50' : ''
                                    }`}
                                >
                                    <img 
                                        className="w-32 sm:w-40 mb-4 sm:mb-0" 
                                        src={item.product.img} 
                                        alt={item.product.name} 
                                    />
                                    <div className="flex-1 w-full sm:ml-4">
                                        <div className="flex justify-between items-start">
                                            <p className="font-semibold">{item.product.name}</p>
                                            <button 
                                                onClick={() => deleteCartItem(item.cart_id)}
                                                disabled={isUpdating[item.cart_id]}
                                                className="text-red-600 font-bold px-3 py-1 bg-red-200 hover:bg-red-300 transition duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ml-2"
                                            >
                                                ลบ
                                            </button>
                                        </div>
                                        <p className="text-red-500 font-bold mt-2">ราคา {item.product.price.toLocaleString()}.-</p>
                                        <div className="flex items-center justify-center sm:justify-start mt-4">
                                            <button
                                                onClick={() => updateCartItemQuantity(item.cart_id, item.quantity - 1)}
                                                disabled={item.quantity <= 1 || isUpdating[item.cart_id]}
                                                className="bg-gray-300 px-5 py-1 rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed"
                                            >
                                                -
                                            </button>
                                            <span className="mx-3">{item.quantity}</span>
                                            <button
                                                onClick={() => updateCartItemQuantity(item.cart_id, item.quantity + 1)}
                                                disabled={isUpdating[item.cart_id]}
                                                className="bg-gray-300 px-5 py-1 rounded-full disabled:cursor-not-allowed"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">ไม่มีสินค้าในตะกร้า</p>
                    )}
                </div>

                {/* Order Summary for Desktop */}
                <div className="hidden lg:block bg-gray-100 p-5 rounded-lg shadow-md h-fit">
                    <h2 className="text-lg font-bold mb-3">สรุปยอดรวม</h2>
                    <div className="border-b-2 border-black mb-3"></div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>ยอดรวม:</span>
                            <span className="font-bold">{totalPrice.toLocaleString()}.-</span>
                        </div>
                        <div className="flex justify-between">
                            <span>จำนวน:</span>
                            <span className="font-bold">{totalQuantity}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>ค่าจัดส่ง:</span>
                            <span className="font-bold">ฟรี</span>
                        </div>

                        <div className="flex justify-between border-t pt-2 font-bold text-lg">
                            <span>รวมทั้งหมด:</span>
                            <span>{totalPrice.toLocaleString()}.-</span>
                        </div>
                    </div>

                    <a href="/payment">
                        <button 
                            className="w-full text-white py-2 mt-4 rounded-lg transition duration-200 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={cartItems.length === 0}
                        >
                            ดำเนินการสั่งซื้อ
                        </button>
                    </a>
                </div>
            </div>
        </div>
    );
}