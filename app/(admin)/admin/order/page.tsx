"use client";
import { useState } from "react";

export default function AdminViewUser() {
    // ข้อมูลคำสั่งซื้อ
    const [users, setUsers] = useState([
        { id: 1, code: 'abcdef0123456789', email: 'asdzxc@gmail.com', status: "กำลังจัดส่ง", isEditing: false },
        { id: 2, code: 'xyz789', email: 'user2@example.com', status: "จัดส่งแล้ว", isEditing: false },
        { id: 3, code: 'def456', email: 'user3@example.com', status: "ยกเลิก", isEditing: false },
        { id: 4, code: 'ghi101', email: 'user4@example.com', status: "กำลังจัดส่ง", isEditing: false },
        { id: 5, code: 'jkl112', email: 'user5@example.com', status: "จัดส่งแล้ว", isEditing: false },
    ]);

    // ตัวกรองสถานะ
    const [filterStatus, setFilterStatus] = useState("ทั้งหมด");

    // ฟังก์ชันกรองสถานะ
    const filteredUsers = filterStatus === "ทั้งหมด"
        ? users
        : users.filter(user => user.status === filterStatus);

    // ฟังก์ชันแก้ไขสถานะ
    const handleStatusChange = (id: number, newStatus: string) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === id ? { ...user, status: newStatus } : user
            )
        );
    };

    // ฟังก์ชันบันทึกการเปลี่ยนแปลง
    const handleSave = (id: number) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === id ? { ...user, isEditing: false } : user
            )
        );
        alert(`สถานะของคำสั่งซื้อ ${id} ได้รับการบันทึกเรียบร้อยแล้ว`);
    };

    // ฟังก์ชันแก้ไข
    const handleEdit = (id: number) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === id ? { ...user, isEditing: true } : user
            )
        );
    };

    // ฟังก์ชันยกเลิกการแก้ไข
    const handleCancelEdit = (id: number) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === id ? { ...user, isEditing: false } : user
            )
        );
    };

    return (
        <div className="flex flex-col p-6">
            <div className="container rounded-lg shadow-lg bg-white p-6">
                <h1 className="text-2xl font-semibold mb-6 text-center">จัดการ Order</h1>

                {/* Dropdown เลือกสถานะ */}
                <div className="mb-4 flex justify-end">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border rounded-md shadow-sm"
                    >
                        <option value="ทั้งหมด">แสดงทั้งหมด</option>
                        <option value="กำลังจัดส่ง">กำลังจัดส่ง</option>
                        <option value="จัดส่งแล้ว">จัดส่งแล้ว</option>
                        <option value="ยกเลิก">ยกเลิก</option>
                    </select>
                </div>

                {/* หัวข้อของตาราง */}
                <div className="grid grid-cols-6 gap-4 bg-gray-800 text-white p-2 rounded-md text-center">
                    <span>Order ID</span>
                    <span>หมายเลขคำสั่งซื้อ</span>
                    <span>อีเมล</span>
                    <span>สถานะ</span>
                    <span>จัดการ</span>
                </div>

                {/* ข้อมูลคำสั่งซื้อ */}
                <div className="divide-y divide-gray-300">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <div key={user.id} className="grid grid-cols-6 gap-4 text-center items-center p-2">
                                <span>{user.id}</span>
                                <span>{user.code}</span>
                                <span>{user.email}</span>

                                {/* แก้ไขสถานะ */}
                                {user.isEditing ? (
                                    <select
                                        value={user.status}
                                        onChange={(e) => handleStatusChange(user.id, e.target.value)}
                                        className="px-2 py-1 border rounded-md"
                                    >
                                        <option value="กำลังจัดส่ง">กำลังจัดส่ง</option>
                                        <option value="จัดส่งแล้ว">จัดส่งแล้ว</option>
                                        <option value="ยกเลิก">ยกเลิก</option>
                                    </select>
                                ) : (
                                    <span>{user.status}</span>
                                )}

                                {/* ปุ่มจัดการ */}
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
                        ))
                    ) : (
                        <div className="text-center p-4 col-span-6">ไม่มีคำสั่งซื้อที่ตรงกับสถานะนี้</div>
                    )}
                </div>
            </div>
        </div>
    );
}
