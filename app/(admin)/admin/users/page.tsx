"use client";
import Swal from 'sweetalert2';

import { useState, useEffect } from "react";
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

// ลงทะเบียน scale และ องค์ประกอบต่างๆ ที่จำเป็น
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

// กำหนดประเภทของ User
type User = {
    user_id: number;
    name: string;
    email: string;
    total_spent: number;
    img: string;
    status: number; // เพิ่มฟิลด์ status สำหรับแสดงสถานะ
    role: string; // เพิ่มฟิลด์ role สำหรับเก็บตำแหน่งของผู้ใช้
};

export default function AdminViewUser() {
    const [users, setUsers] = useState<User[]>([]); // กำหนด type เป็น User[]
    const [topUsers, setTopUsers] = useState<User[]>([]); // กำหนด type เป็น User[]
    const [editUser, setEditUser] = useState<User | null>(null); // สำหรับการแก้ไขข้อมูล
    const [showPopup, setShowPopup] = useState(false); // สำหรับการแสดง/ซ่อน Popup

    // ดึงข้อมูลผู้ใช้จาก API เมื่อคอมโพเนนต์โหลด
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`/api/admin/users`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }
                const data = await response.json();
                setUsers(data.allUsers); // เซ็ตข้อมูลผู้ใช้ที่ได้จาก API
            } catch (error) {
                console.error(error);
            }
        };

        fetchUsers();
    }, []);

    // ฟังก์ชันที่คำนวณ top 3 users เมื่อโหลดข้อมูลผู้ใช้เสร็จ
    useEffect(() => {
        if (users.length > 0) {
            const top3Users = [...users].sort((a, b) => b.total_spent - a.total_spent).slice(0, 3);
            setTopUsers(top3Users);
        }
    }, [users]);

    // ข้อมูลสำหรับ Chart.js
    const chartData = {
        labels: topUsers.map((user) => user.name), // ใช้ชื่อผู้ใช้เป็น labels
        datasets: [
            {
                label: "ยอดใช้จ่าย (บาท)", // ชื่อของ dataset
                data: topUsers.map((user) => user.total_spent), // ใช้ยอดใช้จ่ายเป็นข้อมูลในกราฟ
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // สีพื้นหลังของแท่ง
                borderColor: 'rgba(75, 192, 192, 1)', // สีขอบแท่ง
                borderWidth: 1,
            },
        ],
    };
    const fetchUsers = async () => {
        try {
            const response = await fetch(`/api/admin/users`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }
            const data = await response.json();
            setUsers(data.allUsers); // เซ็ตข้อมูลผู้ใช้ที่ได้จาก API
        } catch (error) {
            console.error(error);
        }
    };
    
    // ฟังก์ชันสำหรับเปิด popup และตั้งค่า user ที่ต้องการแก้ไข
    const handleEditClick = (user: User) => {
        setEditUser(user);
        setShowPopup(true);
    };

    // ฟังก์ชันสำหรับบันทึกการแก้ไขข้อมูล
// ฟังก์ชันสำหรับบันทึกการแก้ไขข้อมูล
const handleSaveChanges = async () => {
    if (!editUser) return;

    try {
        const response = await fetch(`/api/admin/users/${editUser.user_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editUser),
        });

        if (response.ok) {
            const updatedUser = await response.json();
            // Update users in the state
            setUsers(users.map(user => user.user_id === updatedUser.user_id ? updatedUser : user));
            setShowPopup(false); // Close popup

            // Success SweetAlert
            Swal.fire({
                title: 'สำเร็จ!',
                text: 'ข้อมูลผู้ใช้ได้รับการบันทึกแล้ว',
                icon: 'success',
                confirmButtonText: 'ตกลง',
            });

            // ดึงข้อมูลผู้ใช้ใหม่หลังการอัปเดต
            await fetchUsers(); // เรียกใช้ฟังก์ชัน fetchUsers เพื่อดึงข้อมูลผู้ใช้ล่าสุด
        } else {
            console.error("Failed to update user");

            // Error SweetAlert
            Swal.fire({
                title: 'ผิดพลาด!',
                text: 'ไม่สามารถบันทึกข้อมูลผู้ใช้ได้',
                icon: 'error',
                confirmButtonText: 'ลองใหม่',
            });
        }
    } catch (error) {
        console.error(error);

        // Error SweetAlert
        Swal.fire({
            title: 'ผิดพลาด!',
            text: 'เกิดข้อผิดพลาดในการเชื่อมต่อ',
            icon: 'error',
            confirmButtonText: 'ลองใหม่',
        });
    }
};

    
    // ฟังก์ชันสำหรับปิด popup
    const handleClosePopup = () => {
        setShowPopup(false);
    };

    // ฟังก์ชันสำหรับการเปลี่ยนสถานะของผู้ใช้
    const handleStatusChange = (user: User) => {
        if (!editUser) return;

        setEditUser({
            ...editUser,
            status: user.status === 1 ? 0 : 1, // เปลี่ยนสถานะเป็น 1 หรือ 0
        });
    };

    // ฟังก์ชันสำหรับการเปลี่ยน Role ของผู้ใช้
    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!editUser) return;

        setEditUser({
            ...editUser,
            role: e.target.value, // เปลี่ยน Role
        });
    };

    return (
        <div className="flex flex-col p-2">
            <div className="container rounded-lg">
                <div className="flex flex-1 flex-row">
                    <h1 className="text-2xl font-semibold p-4 mb-6 mr-10">จัดการผู้ใช้</h1>
                </div>

                <div className="flex flex-row justify-between">
                    <div className="w-3/4">  {/* ใช้ 3/4 ของพื้นที่สำหรับตาราง */}
                        {/* หัวข้อของตาราง */}
                        <div className="grid grid-cols-8 gap-4 bg-gray-800 text-white p-2 rounded-md text-center">
                            <span>ID</span>
                            <span>ชื่อ</span>
                            <span>อีเมล</span>
                            <span>ยอดใช้จ่าย</span>
                            <span>รูปภาพ</span>
                            <span>สถานะ</span> {/* เพิ่มคอลัมน์สถานะ */}
                            <span>Role</span> {/* เพิ่มคอลัมน์ Role */}
                            <span>จัดการ</span>
                        </div>
                        {/* ข้อมูลผู้ใช้ */}
                        <div className="divide-y divide-gray-300">
                            {users.map((user) => (
                                <div key={user.user_id} className="grid grid-cols-8 gap-4 text-center items-center p-2">
                                    <span>{user.user_id}</span>
                                    <span>{user.name}</span>
                                    <span>{user.email}</span>
                                    <span>{user.total_spent.toLocaleString()}</span>
                                    <span><img src={user.img} alt={user.name} className="w-10 h-10 rounded-full" /></span>
                                    <span className={user.status === 1 ? 'text-green-500' : 'text-red-500'}>
                                        {user.status === 1 ? 'Active' : 'Inactive'}
                                    </span>
                                    {/* แสดงสถานะ */}
                                    <span>{user.role}</span> {/* แสดง Role */}
                                    <button
                                        onClick={() => handleEditClick(user)}
                                        className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition"
                                    >
                                        แก้ไข
                                    </button>
                                    
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* กราฟแท่งแสดง top 3 users */}
                    {topUsers.length > 0 && (
                        <div className="w-1/4 ml-4" style={{ height: "300px" }}>  {/* ใช้ 1/4 ของพื้นที่และกำหนดความสูงของกราฟ */}
                            <h2 className="text-xl font-semibold mb-4">Top 3 Users ที่มียอดใช้จ่ายสูงสุด</h2>
                            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
                        </div>
                    )}
                </div>
            </div>

            {/* Popup สำหรับแก้ไขข้อมูล */}
            {showPopup && editUser && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-10">
                    <div className="bg-white p-4 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-xl font-semibold mb-4">แก้ไขข้อมูลผู้ใช้</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">ชื่อ</label>
                            <input
                                type="text"
                                value={editUser.name}
                                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">อีเมล</label>
                            <input
                                type="email"
                                value={editUser.email}
                                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        {/* เพิ่มส่วนของการเปลี่ยนสถานะ */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">สถานะ</label>
                            <select
                                value={editUser.status}
                                onChange={(e) => setEditUser({ ...editUser, status: Number(e.target.value) })}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value={1}>Active</option>
                                <option value={0}>Inactive</option>
                            </select>
                        </div>
                        {/* เพิ่มส่วนของการเปลี่ยน Role */}
                        
                        <div className="flex justify-end space-x-2">
                            <button onClick={handleClosePopup} className="bg-gray-500 text-white px-4 py-1 rounded-md hover:bg-gray-600">ยกเลิก</button>
                            <button onClick={handleSaveChanges} className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600">บันทึก</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
