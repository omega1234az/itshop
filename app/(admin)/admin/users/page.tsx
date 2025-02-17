"use client"; // ให้แน่ใจว่าใช้ "use client" ที่ด้านบนสุด

import { useState, useEffect } from "react";
import Swal from "sweetalert2";

type User = {
  user_id: number;
  name: string;
  email: string;
  orders: number;  // จำนวนคำสั่งซื้อ
  totalAmount: number;  // จำนวนเงินทั้งหมด
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // ใช้ข้อมูลตัวอย่างพร้อมจำนวนคำสั่งซื้อและยอดเงิน
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    // ข้อมูลตัวอย่างผู้ใช้พร้อมยอดสั่งซื้อ
    const data: User[] = [
      { user_id: 1, name: "John Doe", email: "johndoe@example.com", orders: 5, totalAmount: 5 * 500 },
      { user_id: 2, name: "Jane Smith", email: "janesmith@example.com", orders: 3, totalAmount: 3 * 500 },
      { user_id: 3, name: "Michael Lee", email: "michaellee@example.com", orders: 7, totalAmount: 7 * 500 },
    ];
    setUsers(data);
  };

  const deleteUser = async (id: number) => {
    const confirmDelete = await Swal.fire({
      title: "ยืนยันการลบ?",
      text: "คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (confirmDelete.isConfirmed) {
      // ลบข้อมูลจาก state ตาม ID
      setUsers(users.filter(user => user.user_id !== id));
      Swal.fire("ลบสำเร็จ!", "ผู้ใช้ถูกลบเรียบร้อยแล้ว", "success");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">👤 จัดการผู้ใช้</h1>
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="p-2">ID</th>
            <th className="p-2">ชื่อ</th>
            <th className="p-2">อีเมล</th>
            <th className="p-2">ยอดสั่งซื้อ</th>
            <th className="p-2">ยอดใช้จ่าย</th> {/* เพิ่มคอลัมน์จำนวนเงิน */}
            <th className="p-2">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.user_id} className="border-b text-center">
                <td className="p-2">{user.user_id}</td>
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.orders}</td> {/* แสดงยอดสั่งซื้อ */}
                <td className="p-2">{user.totalAmount.toLocaleString("th-TH")}</td> {/* แสดงจำนวนเงิน */}
                <td className="p-2">
                  <button
                    onClick={() => deleteUser(user.user_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center p-4">
                ไม่มีข้อมูลผู้ใช้
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
