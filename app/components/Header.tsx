"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// interface สำหรับผู้ใช้
interface User {
    user_id: number;
    name: string;
    email: string;
    img?: string;
}

export default function Header() {
    const [user, setUser] = useState<User | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [cartCount, setCartCount] = useState<number>(0);

    // ดึงข้อมูลผู้ใช้
    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("/api/auth/me", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                if (!res.ok) return;
                const data = await res.json();
                setUser(data);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        }
        fetchUser();
    }, []);

    // ดึงจำนวนสินค้าจาก API /api/cart
    useEffect(() => {
        async function fetchCartCount() {
            if (!user) return; // ถ้ายังไม่มีข้อมูล user ไม่ต้อง fetch
            try {
                const res = await fetch("/api/cart", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-User-ID": String(user.user_id), // ส่ง user_id ไปใน headers
                    },
                });

                if (!res.ok) return;
                const data = await res.json();
                setCartCount(data.length); // สมมติว่า API คืนอาร์เรย์ของสินค้า
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        }

        fetchCartCount();
    }, [user]); // ทำงานเมื่อ user เปลี่ยนค่า

    return (
        <div className="mx-auto container grid grid-cols-10 text-center items-center gap-5">
            <Link href="/" className="bg-red-400 p-5">Logo</Link>
            <Link href="/contact" className="font-bold">ติดต่อ</Link>
            <input className="border border-black col-span-5 p-2 rounded-lg" placeholder="ค้นหา"></input>
            <Link href="/productlist">
                <img src="/icon/search.png" alt="search" className="cursor-pointer" />
            </Link>

            {/* แสดงจำนวนสินค้าบน icon ตะกร้า */}
            <Link href="/cart" className="ml-auto pr-10 relative">
                <img src="/icon/cart.png" alt="cart" className="cursor-pointer w-7" />
                {cartCount > 0 && (
                    <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {cartCount}
                    </span>
                )}
            </Link>

            {/* แสดงข้อมูลผู้ใช้ */}
            {user ? (
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-14 h-14 mt-2 rounded-full border border-gray-300 overflow-hidden"
                    >
                        <img
                            src={user?.img}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-48 z-10">
                            <ul>
                                <li>
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                    >
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={async () => {
                                            await fetch("/api/auth/logout", { method: "POST" });
                                            window.location.reload();
                                        }}
                                        className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            ) : (
                <Link className="bg-teal-400 hover:bg-teal-500 rounded-lg p-2 font-bold" href="/login">
                    Login
                </Link>
            )}
        </div>
    );
}
