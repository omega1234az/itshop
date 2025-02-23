"use client";
import { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
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
  Title,
  Tooltip,
  Legend
);

// กำหนด Type สำหรับข้อมูลจาก API
interface ChartData {
  total_sales_this_month: number;
  total_orders_this_month: number;
  new_users_this_month: number;
  pending_orders: number;
  monthly_sales: { date: string; total_sales: number }[];
  salesByCategory: { category_id: number; category_name: string; total_sales: number }[];
}

export default function AdminDashboard() {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/admin/chart") // เรียก API
      .then((res) => res.json())
      .then((data: ChartData) => {
        setChartData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching chart data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center text-lg">กำลังโหลดข้อมูล...</p>;
  }

  if (!chartData) {
    return <p className="text-center text-lg text-red-500">ไม่สามารถโหลดข้อมูลได้</p>;
  }

  // กราฟแนวโน้มยอดขายรายวัน
  const dailySalesData = {
    labels: chartData.monthly_sales.map((day) => day.date),
    datasets: [
      {
        label: "ยอดขายรายวัน",
        data: chartData.monthly_sales.map((day) => day.total_sales),
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        tension: 0.3,
      },
    ],
  };

  // กราฟยอดขายตามหมวดหมู่
  const salesByCategoryData = {
    labels: chartData.salesByCategory.map((cat) => cat.category_name),
    datasets: [
      {
        label: "ยอดขาย",
        data: chartData.salesByCategory.map((cat) => cat.total_sales),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#8E44AD", "#2ECC71", "#E67E22"],
      },
    ],
  };

  return (
    <div className="flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Dashboard Admin</h1>

      {/* แสดงสถิติสำคัญ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card title="ยอดขายเดือนนี้" value={`฿${chartData.total_sales_this_month.toLocaleString()}`} icon="💰" />
        <Card title="จำนวนคำสั่งซื้อ" value={chartData.total_orders_this_month} icon="📦" />
        <Card title="ลูกค้าใหม่" value={chartData.new_users_this_month} icon="👥" />
        <Card title="คำสั่งซื้อรอดำเนินการ" value={chartData.pending_orders} icon="⏳" />
      </div>

      {/* แสดงกราฟ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* กราฟแนวโน้มยอดขายรายวัน */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-sm font-semibold mb-2">แนวโน้มยอดขายเดือนนี้</h2>
          <Line data={dailySalesData} options={{ responsive: true }} />
        </div>

        {/* กราฟยอดขายตามหมวดหมู่ */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-sm font-semibold mb-2">ยอดขายแยกตามหมวดหมู่</h2>
          <Bar data={salesByCategoryData} options={{ responsive: true }} />
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
    <div className="bg-white p-4 shadow rounded-lg flex items-center">
      <span className="text-2xl mr-3">{icon}</span>
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}
