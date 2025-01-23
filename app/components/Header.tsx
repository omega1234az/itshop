"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    getCookie,
    getCookies,
    setCookie,
    deleteCookie,
    hasCookie,
    useGetCookies,
    useSetCookie,
    useHasCookie,
    useDeleteCookie,
    useGetCookie,
  } from 'cookies-next/client';

// กำหนด interface สำหรับข้อมูลผู้ใช้
interface User {
    user_id: number;
    name: string;
    email: string;
    img?: string;
}

export default function Header() {
    const deleteCookie = useDeleteCookie();
    const [user, setUser] = useState<User | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    // ฟังก์ชันสำหรับ fetch ข้อมูลผู้ใช้
    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("/api/auth/me", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include", // ส่ง Cookie ไปด้วย
                });
    
                if (res.status === 401 || res.status === 403) {
                    console.log("User not authenticated"); // ไม่ใช่ข้อผิดพลาดจริง
                    return; // ออกจากฟังก์ชันโดยไม่โยน error
                }
    
                if (!res.ok) throw new Error("Failed to fetch");
    
                const data = await res.json();
                setUser(data);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        }
    
        fetchUser();
    }, []);

    // ฟังก์ชัน logout: ลบคุกกี้ session_id
    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.reload(); // รีเฟรชหลังลบ Cookie
      };
      

    return (
        <div className="mx-auto container grid grid-cols-10 text-center items-center gap-5">
            <Link href="/" className="bg-red-400 p-5">Logo</Link>
            <Link href="/contact" className="font-bold">ติดต่อ</Link>
            <input className="border border-black col-span-5 p-2 rounded-lg" placeholder="ค้นหา"></input>
            <Link href="/productlist">
                <img src="/icon/search.png" alt="search" className="cursor-pointer" />
            </Link>
            <Link href="/cart" className="ml-auto pr-10">
                <img src="/icon/cart.png" alt="cart" className="cursor-pointer w-7" />
            </Link>

            {/* ถ้ามี user ให้แสดงรูปโปรไฟล์และ dropdown */}
            {user ? (
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-14 h-14 mt-2 rounded-full border border-gray-300 overflow-hidden"
                    >
                        <img
                            src={`/uploads/profile/${user.img}`}
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
                                        onClick={handleLogout}
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
                <Link className="bg-[#0294BD] p-2 rounded-lg" href="/login">
                    Login
                </Link>
            )}
        </div>
    );
}
