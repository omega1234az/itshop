"use client";
import { useState } from "react";

export default function AdminViewUser() {
    // กำหนดข้อมูลผู้ใช้เริ่มต้น
    const [users, setUsers] = useState<{ id: number; code: string; email: string; status: string; isEditing: boolean }[]>([
        { id: 1, code: 'abcdef0123456789', email: 'asdzxc@gmail.com', status: "กำลังจัดส่ง", isEditing: false },
    ]);

    // ฟังก์ชันในการอัปเดตสถานะของผู้ใช้
    const handleStatusChange = (id: number, newStatus: string) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === id ? { ...user, status: newStatus } : user
            )
        );
    };

    // ฟังก์ชันบันทึกการเปลี่ยนแปลงสถานะ
    const handleSave = (id: number) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === id ? { ...user, isEditing: false } : user
            )
        );
        alert(`สถานะของคำสั่งซื้อ ${id} ได้รับการบันทึกเรียบร้อยแล้ว`);
    };

    // ฟังก์ชันสำหรับการแก้ไขข้อมูลผู้ใช้
    const handleEdit = (id: number) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === id ? { ...user, isEditing: true } : user
            )
        );
    };

    // ฟังก์ชันสำหรับการยกเลิกการแก้ไข
    const handleCancelEdit = (id: number) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === id ? { ...user, isEditing: false } : user
            )
        );
    };

    return (
        <div className="flex flex-col p-6">
            <div className="container rounded-lg shadow-lg bg-white">
                <h1 className="text-2xl font-semibold p-4 mb-6">จัดการ Order</h1>
                {/* หัวข้อของตาราง */}
                <div className="grid grid-cols-6 gap-4 bg-gray-800 text-white p-2 rounded-md text-center">
                    <span>Order ID</span>
                    <span>หมายเลขคำสั่งซื้อ</span>
                    <span>อีเมล</span>
                    <span>สถานะ</span>
                    <span>จัดการ</span>
                </div>
                
                {/* ข้อมูลผู้ใช้ที่ไม่เรียงลำดับ */}
                <div className="divide-y divide-gray-300">
                    {users.map((user) => (
                        <div key={user.id} className="grid grid-cols-6 gap-4 text-center items-center p-2">
                            <span>{user.id}</span>
                            <span>{user.code}</span>
                            <span>{user.email}</span>
                            
                            {/* การเลือกสถานะจาก dropdown หรือแสดงสถานะ */}
                            {user.isEditing ? (
                                <select
                                    value={user.status}
                                    onChange={(e) => handleStatusChange(user.id, e.target.value)}
                                    className="px-2 py-1 rounded-md"
                                >
                                    <option value="กำลังจัดส่ง">กำลังจัดส่ง</option>
                                    <option value="จัดส่งแล้ว">จัดส่งแล้ว</option>
                                    <option value="ยกเลิก">ยกเลิก</option>
                                </select>
                            ) : (
                                <span>{user.status}</span>
                            )}
                            
                            {/* ปุ่มบันทึก, แก้ไข และลบ */}
                            <div className="flex justify-center gap-2">
                                {user.isEditing ? (
                                    <>
                                        <button
                                            onClick={() => handleSave(user.id)}
                                            className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600 transition"
                                        >
                                            บันทึก
                                        </button>
                                        <button
                                            onClick={() => handleCancelEdit(user.id)}
                                            className="bg-gray-500 text-white px-4 py-1 rounded-md hover:bg-gray-600 transition"
                                        >
                                            ยกเลิก
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => handleEdit(user.id)}
                                        className="bg-yellow-500 text-white px-4 py-1 rounded-md hover:bg-yellow-600 transition"
                                    >
                                        แก้ไข
                                    </button>
                                )}
                                <button className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition">
                                    ลบ
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
