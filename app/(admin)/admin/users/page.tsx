"use client";
import { useState } from "react";

export default function AdminViewUser() {
    // กำหนดข้อมูลผู้ใช้เริ่มต้น
    const [users, setUsers] = useState<{ id: number; name: string; email: string; orders: number; spent: number; }[]>([
        { id: 1, name: 'Jhon', email: 'asdzxc@gmail.com', orders: 20, spent: 2000 },
        { id: 2, name: 'Jhon', email: 'jhon@example.com', orders: 15, spent: 1500 },
        { id: 3, name: 'Jhon', email: 'jhon@example.com', orders: 15, spent: 1500 },
        { id: 4, name: 'Alice', email: 'alice@example.com', orders: 25, spent: 2500 },
        { id: 5, name: 'Bob', email: 'bob@example.com', orders: 10, spent: 1000 },
    ]);
    
    // ตั้งค่าหมายเลขที่ใช้สำหรับแสดง popup และผู้ใช้ที่มียอดสั่งซื้อสูงสุด
    const [showPopup, setShowPopup] = useState(false);
    const [topUsers, setTopUsers] = useState<{ id: number; name: string; email: string; orders: number; spent: number; }[]>([]);

    // ฟังก์ชันดึงข้อมูลผู้ใช้ที่มียอดสั่งซื้อสูงสุด
    const fetchTopUsers = () => {
        const top5Users = [...users].sort((a, b) => b.orders - a.orders).slice(0, 5);
        setTopUsers(top5Users);
        setShowPopup(true);
    };

    return (
        <div className="flex flex-col p-2">
            <div className="container rounded-lg">
                <div className="flex flex-1 flex-row">
                    <h1 className="text-2xl font-semibold p-4 mb-6 mr-10">จัดการผู้ใช้</h1>
                    
                    {/* ปุ่มดูยอดสั่งซื้อสูงสุด */}
                    <button 
                        className="bg-blue-500 text-white rounded-md mb-4 hover:bg-blue-600 transition w-40 h-10 mt-3"
                        onClick={fetchTopUsers}>
                        ดูยอดคำสั่งซื้อสูงสุด
                    </button>
                </div>
                
                {/* หัวข้อของตาราง */}
                <div className="grid grid-cols-6 gap-4 bg-gray-800 text-white p-2 rounded-md text-center">
                    <span>ID</span>
                    <span>ชื่อ</span>
                    <span>อีเมล</span>
                    <span>ยอดคำสั่งซื้อ</span>
                    <span>ยอดใช้จ่าย</span>
                    <span>จัดการ</span>
                </div>
                
                {/* ข้อมูลผู้ใช้ที่ไม่เรียงลำดับ */}
                <div className="divide-y divide-gray-300">
                    {users.map((user) => (
                        <div key={user.id} className="grid grid-cols-6 gap-4 text-center items-center p-2">
                            <span>{user.id}</span>
                            <span>{user.name}</span>
                            <span>{user.email}</span>
                            <span>{user.orders}</span>
                            <span>{user.spent}</span>
                            <button className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition">ลบ</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Popup สำหรับแสดงผู้ใช้ที่มียอดสั่งซื้อสูงสุด */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Top 5 ซื้อเยอะที่สุด</h2>
                        <ul>
                            {topUsers.map((user) => (
                                <li key={user.id} className="mb-2">{user.name} - {user.orders} orders</li>
                            ))}
                        </ul>
                        <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition" onClick={() => setShowPopup(false)}>ปิด</button>
                    </div>
                </div>
            )}
        </div>
    );
}
