"use client";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <ul>
        <li className="mb-4"><a href="#" className="hover:text-gray-400">🏠 หน้าหลัก</a></li>
        <li className="mb-4"><a href="#" className="hover:text-gray-400">👤 จัดการผู้ใช้</a></li>
        <li className="mb-4"><a href="#" className="hover:text-gray-400">📦 จัดการออเดอร์</a></li>
        <li className="mb-4"><a href="#" className="hover:text-gray-400">📊 รายงานยอดขาย</a></li>
      </ul>
    </div>
  );
}
