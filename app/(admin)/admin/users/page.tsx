"use client";
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

export default function AdminViewUser() {
    const [users, setUsers] = useState<{ user_id: number; name: string; email: string; total_spent: number; img: string; }[]>([]);
    const [topUsers, setTopUsers] = useState<{ user_id: number; name: string; total_spent: number; img: string; }[]>([]);

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

    return (
        <div className="flex flex-col p-2">
            <div className="container rounded-lg">
                <div className="flex flex-1 flex-row">
                    <h1 className="text-2xl font-semibold p-4 mb-6 mr-10">จัดการผู้ใช้</h1>
                </div>

                <div className="flex flex-row justify-between">
                    <div className="w-3/4">  {/* ใช้ 3/4 ของพื้นที่สำหรับตาราง */}
                        {/* หัวข้อของตาราง */}
                        <div className="grid grid-cols-6 gap-4 bg-gray-800 text-white p-2 rounded-md text-center">
                            <span>ID</span>
                            <span>ชื่อ</span>
                            <span>อีเมล</span>
                            <span>ยอดใช้จ่าย</span>
                            <span>รูปภาพ</span>
                            <span>จัดการ</span>
                        </div>
                        {/* ข้อมูลผู้ใช้ */}
                        <div className="divide-y divide-gray-300">
                            {users.map((user) => (
                                <div key={user.user_id} className="grid grid-cols-6 gap-4 text-center items-center p-2">
                                    <span>{user.user_id}</span>
                                    <span>{user.name}</span>
                                    <span>{user.email}</span>
                                    <span>{user.total_spent}</span>
                                    <span><img src={user.img} alt={user.name} className="w-10 h-10 rounded-full" /></span>
                                    <button className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition">ลบ</button>
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
        </div>
    );
}
