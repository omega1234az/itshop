"use client";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <ul>
        <li className="mb-4"><a href="dashboard" className="hover:text-gray-400">🏠 หน้าหลัก</a></li>
        <li className="mb-4"><a href="users" className="hover:text-gray-400">👤 จัดการผู้ใช้</a></li>
        <li className="mb-4"><a href="order" className="hover:text-gray-400">📦 จัดการออเดอร์</a></li>
        <li className="mb-4"><a href="#" className="hover:text-gray-400">📊 รายงานยอดขาย</a></li>
      </ul>
    </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {children}  {/* ส่วนนี้จะเป็นเนื้อหาของแต่ละหน้าที่ใช้งาน Layout นี้ */}
      </div>
    </div>
  );
}
