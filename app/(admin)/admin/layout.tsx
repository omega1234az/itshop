"use client";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-gray-900 text-white h-screen p-6 shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h2>
        <ul className="space-y-4">
          <li>
            <a href="dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition">
              🏠 หน้าหลัก
            </a>
          </li>
          <li>
            <a href="users" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition">
              👤 จัดการผู้ใช้
            </a>
          </li>
          <li>
          <a href="products" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition">
              📦 จัดการสินค้า
            </a>
           
          </li>
          <li>
          <a href="order" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition">
          🛒 จัดการออเดอร์
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition">
              📊 รายงานยอดขาย
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-white shadow-md rounded-lg m-4">
        {children}  {/* ส่วนนี้จะเป็นเนื้อหาของแต่ละหน้าที่ใช้งาน Layout นี้ */}
      </div>
    </div>
  );
}
