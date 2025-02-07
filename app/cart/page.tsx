"use client";
import { useEffect, useState } from "react";

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
    const hasOutOfStock = cartItems.some((item) => item.out_of_stock);
    const deleteCartItem = async (cart_id: number) => {
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
    
            alert("ลบสินค้าออกจากตะกร้าเรียบร้อย");
            setCartItems(cartItems.filter((item) => item.cart_id !== cart_id)); // อัปเดตตะกร้า
        } catch (error) {
            console.error("Error deleting cart item:", error);
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
    
            // เช็คกรณีที่ไม่มีสินค้าในตระกร้า
            if (data.message === "No items found in cart") {
                console.log("ไม่มีสินค้าในตระกร้า");
                setCartItems([]); // หรือเปลี่ยนเส้นทางไปยังหน้าที่ต้องการ
                return;
            }
    
            setCartItems(data);
        } catch (error) {
            console.error("Error fetching cart items:", error);
            window.location.href = "/login"; // หรือกรณีที่ต้องการให้ไปหน้า login
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
            {/* รายการสินค้า */}
            <div className="col-span-2 overflow-y-scroll max-h-screen h-fit">
                <h2 className="text-lg font-bold mb-3">ตะกร้าสินค้า</h2>
                <div className="border-b-2 border-black mb-3"></div>
                {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                        <div
                            key={item.cart_id}
                            className={`grid grid-cols-2 items-center border p-4 rounded-lg shadow-md mb-3 ${item.out_of_stock ? "bg-gray-200 opacity-75" : ""}`}
                        >
                            <img className="w-40" src={item.product.img} alt={item.product.name} />
                            <div>
                                <p className="font-semibold">{item.product.name}</p>
                                <p className="text-red-500 font-bold mt-2">ราคา {item.product.price.toLocaleString()}.-</p>
                                <p className="mt-1">จำนวน: {item.quantity}</p>
                                {item.out_of_stock && (
                                    <p className="text-red-600 font-bold mt-2">สินค้าหมด</p>
                        
                                )}
                                {item.out_of_stock && (
                                    <div className="w-full text-right">
                                        <button onClick={() => deleteCartItem(item.cart_id)} className="text-red-600 font-bold mt-2  text-right px-5 bg-red-200">ลบ</button>
                                    </div>
                                    
                        
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">ไม่มีสินค้าในตะกร้า</p>
                )}

            </div>

            {/* สรุปยอดรวม */}
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
                <a href={hasOutOfStock ? "#" : "/payment"}>
    <button 
        className={`w-full text-white py-2 mt-4 rounded-lg transition duration-200 
            ${hasOutOfStock ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}
        `}
        disabled={hasOutOfStock}
    >
        ดำเนินการสั่งซื้อ
    </button>
</a>

            </div>
        </div>
    );
}