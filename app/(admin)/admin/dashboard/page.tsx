"use client";
import { useState } from "react";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [totalRevenue, setTotalRevenue] = useState<number>(35000);
  const [totalOrders, setTotalOrders] = useState<number>(150);
  const [totalUsers, setTotalUsers] = useState<number>(120);
  const [pendingOrders, setPendingOrders] = useState<number>(20);
  const [avgOrderValue, setAvgOrderValue] = useState<number>(totalRevenue / totalOrders);

  // กราฟแนวโน้มยอดขายรายวัน (ใหม่)
  const dailySalesData = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    datasets: [
      {
        label: "ยอดขายรายวัน",
        data: [100, 200, 400, 300, 500, 700, 600, 800, 900, 1000],
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        tension: 0.3,
      },
    ],
  };

  // กราฟยอดขายตามหมวดหมู่สินค้า (เก่า)
  const salesByCategoryData = {
    labels: ["CPU", "Mainboard", "Ram", "SSD"],
    datasets: [
      {
        label: "ยอดขาย",
        data: [5000, 12000, 8000, 4000],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"],
      },
    ],
  };

  // กราฟพฤติกรรมลูกค้า (ใหม่)


  return (
    <div className="flex">
      {/* Sidebar เมนู */}
      
      {/* Main Content */}
      <div className="flex-1 p-4">
        <h1 className="text-xl font-bold mb-3">Dashboard Admin</h1>

        {/* แสดงสถิติสำคัญ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          <Card title="ยอดขายรวม" value={`฿${totalRevenue}`} icon="💰" />
          <Card title="จำนวนคำสั่งซื้อ" value={totalOrders} icon="📦" />
          <Card title="ลูกค้าทั้งหมด" value={totalUsers} icon="👥" />
          <Card title="คำสั่งซื้อรอดำเนินการ" value={pendingOrders} icon="⏳" />
        </div>

        {/* แสดงกราฟทั้งหมด */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* กราฟแนวโน้มยอดขายรายวัน */}
          <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-sm font-semibold mb-2">แนวโน้มยอดขายรายวัน</h2>
            <Line data={dailySalesData} options={{ responsive: true }} />
          </div>

          {/* กราฟยอดขายตามหมวดหมู่สินค้า */}
          <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-sm font-semibold mb-2">ยอดขายแยกตามหมวดหมู่</h2>
            <Bar data={salesByCategoryData} options={{ responsive: true }} />
          </div>

          
        </div>
      </div>
    </div>
  );
}

// Component สำหรับแสดงข้อมูลสถิติ
type CardProps = {
  title: string;
  value: number | string;
  icon: string;
};

function Card({ title, value, icon }: CardProps) {
  return (
    <div className="bg-white p-2 shadow rounded-lg flex items-center">
      <span className="text-lg mr-2">{icon}</span>
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}
