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

    // ลบสินค้าออกจากตะกร้า
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

    // อัปเดตจำนวนสินค้าในตะกร้า
    const updateCartItemQuantity = async (cart_id: number, quantity: number) => {
        const now = Date.now();
        const lastUpdate = lastUpdateTime[cart_id] || 0;
        const timeDiff = now - lastUpdate;
        
        // ป้องกันการกดถี่เกินไป (500ms)
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

    // ดึงข้อมูลสินค้าในตะกร้า
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
        <div className="container mx-auto grid grid-cols-3 gap-5 mt-5">
            <div className="col-span-2 overflow-y-scroll max-h-screen h-fit">
                <h2 className="text-lg font-bold mb-3">ตะกร้าสินค้า</h2>
                <div className="border-b-2 border-black mb-3"></div>
                {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                        <div
                            key={item.cart_id}
                            className={`grid grid-cols-2 items-center border p-4 rounded-lg shadow-md mb-3 ${
                                isUpdating[item.cart_id] ? 'opacity-50' : ''
                            }`}
                        >
                            <img className="w-40" src={item.product.img} alt={item.product.name} />
                            <div>
                                <p className="font-semibold">{item.product.name}</p>
                                <p className="text-red-500 font-bold mt-2">ราคา {item.product.price.toLocaleString()}.-</p>
                                <div className="flex items-center mt-5">
                                    <button
                                        onClick={() => updateCartItemQuantity(item.cart_id, item.quantity - 1)}
                                        disabled={item.quantity <= 1 || isUpdating[item.cart_id]}
                                        className="bg-gray-300 px-5 rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        -
                                    </button>
                                    <span className="mx-3">{item.quantity}</span>
                                    <button
                                        onClick={() => updateCartItemQuantity(item.cart_id, item.quantity + 1)}
                                        disabled={isUpdating[item.cart_id]}
                                        className="bg-gray-300 px-5 rounded-full disabled:cursor-not-allowed"
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="w-full text-right">
                                    <button 
                                        onClick={() => deleteCartItem(item.cart_id)}
                                        disabled={isUpdating[item.cart_id]}
                                        className="text-red-600 font-bold mt-2 text-right px-5 bg-red-200 hover:bg-red-300 transition duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        ลบ
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">ไม่มีสินค้าในตะกร้า</p>
                )}
            </div>

            <div className="col-span-1 bg-gray-100 p-5 rounded-lg shadow-md h-fit">
                <h2 className="text-lg font-bold mb-3">สรุปยอดรวม</h2>
                <div className="border-b-2 border-black mb-3"></div>

                <div className="flex justify-between mb-2">
                    <span>ยอดรวม:</span>
                    <span className="font-bold">{totalPrice.toLocaleString()}.-</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>จำนวน:</span>
                    <span className="font-bold">{totalQuantity}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>ค่าจัดส่ง:</span>
                    <span className="font-bold">ฟรี</span>
                </div>

                <div className="flex justify-between border-t pt-2 font-bold text-lg">
                    <span>รวมทั้งหมด:</span>
                    <span>{totalPrice.toLocaleString()}.-</span>
                </div>
                <a href="/payment">
                    <button 
                        className="w-full text-white py-2 mt-4 rounded-lg transition duration-200 bg-blue-500 hover:bg-blue-600"
                        disabled={cartItems.length === 0}
                    >
                        ดำเนินการสั่งซื้อ
                    </button>
                </a>
            </div>
        </div>
    );
}