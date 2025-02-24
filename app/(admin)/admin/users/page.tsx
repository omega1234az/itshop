"use client"
import React, { useState, useEffect } from "react";
import { Bar } from 'react-chartjs-2';
import Swal from 'sweetalert2';
import { Package2, FileText, Edit2, UserCheck, UserX, ChevronDown } from "lucide-react";
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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

type User = {
    user_id: number;
    name: string;
    email: string;
    total_spent: number;
    img: string;
    status: number;
    role: string;
};

export default function AdminViewUser() {
    const [users, setUsers] = useState<User[]>([]);
    const [topUsers, setTopUsers] = useState<User[]>([]);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [showPopup, setShowPopup] = useState(false);

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
                if (!response.ok) throw new Error("Failed to fetch users");
                const data = await response.json();
                setUsers(data.allUsers);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (users.length > 0) {
            const top3Users = [...users].sort((a, b) => b.total_spent - a.total_spent).slice(0, 3);
            setTopUsers(top3Users);
        }
    }, [users]);

    const chartData = {
        labels: topUsers.map((user) => user.name),
        datasets: [{
            label: "ยอดใช้จ่าย (บาท)",
            data: topUsers.map((user) => user.total_spent),
            backgroundColor: 'rgba(99, 102, 241, 0.5)',
            borderColor: 'rgb(99, 102, 241)',
            borderWidth: 1,
        }],
    };

    const handleEditClick = (user: User) => {
        setEditUser(user);
        setShowPopup(true);
    };

    const handleSaveChanges = async () => {
        if (!editUser) return;
        try {
            const response = await fetch(`/api/admin/users/${editUser.user_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editUser),
            });

            if (response.ok) {
                setUsers(users.map(user => 
                    user.user_id === editUser.user_id ? editUser : user
                ));
                setShowPopup(false);
                Swal.fire({
                    title: 'สำเร็จ!',
                    text: 'ข้อมูลผู้ใช้ได้รับการบันทึกแล้ว',
                    icon: 'success',
                    confirmButtonText: 'ตกลง',
                });
            } else {
                throw new Error("Failed to update user");
            }
        } catch (error) {
            Swal.fire({
                title: 'ผิดพลาด!',
                text: 'ไม่สามารถบันทึกข้อมูลผู้ใช้ได้',
                icon: 'error',
                confirmButtonText: 'ลองใหม่',
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Package2 className="w-8 h-8 text-indigo-600" />
                            <h1 className="text-2xl font-bold text-gray-900">จัดการผู้ใช้งาน</h1>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">จำนวนผู้ใช้ทั้งหมด:</span>
                            <span className="text-lg font-semibold text-indigo-600">{users.length}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-8">
                    {/* Users Table Section */}
                    <div className="col-span-2 bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <FileText className="w-5 h-5 text-gray-500" />
                                <h2 className="text-lg font-semibold text-gray-900">รายการผู้ใช้</h2>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 text-left">
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ผู้ใช้</th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">อีเมล</th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ยอดใช้จ่าย</th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.user_id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <img src={user.img} alt="" className="w-8 h-8 rounded-full" />
                                                    <span className="font-medium text-gray-900">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{user.email}</td>
                                            <td className="px-6 py-4 text-gray-900">
                                                ฿{user.total_spent.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.status === 1 ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        <UserCheck className="w-4 h-4 mr-1" />
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        <UserX className="w-4 h-4 mr-1" />
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleEditClick(user)}
                                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    <Edit2 className="w-4 h-4 mr-1" />
                                                    แก้ไข
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Top 3 ยอดใช้จ่ายสูงสุด</h2>
                        <div className="h-64">
                            <Bar data={chartData} options={{ 
                                responsive: true, 
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: false
                                    }
                                }
                            }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {showPopup && editUser && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">แก้ไขข้อมูลผู้ใช้</h3>
                        </div>
                        <div className="px-6 py-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">ชื่อ</label>
                                <input
                                    type="text"
                                    value={editUser.name}
                                    onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">อีเมล</label>
                                <input
                                    type="email"
                                    value={editUser.email}
                                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">สถานะ</label>
                                <select
                                    value={editUser.status}
                                    onChange={(e) => setEditUser({ ...editUser, status: Number(e.target.value) })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
                            <button
                                onClick={() => setShowPopup(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleSaveChanges}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
                            >
                                บันทึก
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}