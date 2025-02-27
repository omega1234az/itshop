"use client";
import { useState, useEffect } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
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

interface ChartData {
  total_sales_this_month: number;
  total_orders_this_month: number;
  new_users_this_month: number;
  pending_orders: number;
  conversion_rate: string;
  monthly_sales: { date: string; total_sales: number }[];
  salesByCategory: { category_id: number; category_name: string; total_sales: number }[];
  salesByDayOfWeek: { day: string; total_sales: any }[];
  salesByTimePeriod: { period: string; total_sales: number }[];
}

export default function AdminDashboard() {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/admin/chart")
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
    return <p className="text-center text-lg">\u0e01\u0e33\u0e25\u0e31\u0e07\u0e42\u0e2b\u0e25\u0e14\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25...</p>;
  }

  if (!chartData) {
    return <p className="text-center text-lg text-red-500">\u0e44\u0e21\u0e48\u0e2a\u0e32\u0e21\u0e32\u0e23\u0e16\u0e23\u0e23\u0e21\u0e42\u0e2b\u0e25\u0e14\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e44\u0e14\u0e49</p>;
  }

  return (
    <div className="flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Dashboard Admin</h1>

      {/* แสดงข้อมูลสถิติ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card title="ยอดขายเดือนนี้" value={`฿${chartData.total_sales_this_month.toLocaleString()}`} icon="💰" />
        <Card title="จำนวนคำสั่งซื้อ" value={chartData.total_orders_this_month} icon="📦" />
        <Card title="ลูกค้าใหม่" value={chartData.new_users_this_month} icon="👥" />
        <Card title="คำสั่งซื้อรอดำเนินการ" value={chartData.pending_orders} icon="⏳" />
      </div>
     
      {/* กราฟ */}
      <div className="grid grid-cols-1  md:grid-cols-3 gap-4">
        <ChartBox title="แนวโน้มยอดขายเดือนนี้" chart={ 
          <Line data={{
          labels: chartData.monthly_sales.map((day) => day.date),
          datasets: [{ label: "ยอดขาย", data: chartData.monthly_sales.map((day) => day.total_sales), borderColor: "blue", backgroundColor: "rgba(0,0,255,0.2)", tension: 0.3 }]
        }} /> 
      } 
        />
        <ChartBox title="ยอดขายตามหมวดหมู่" chart={<Bar data={{
          labels: chartData.salesByCategory.map((cat) => cat.category_name),
          datasets: [{ label: "ยอดขาย", data: chartData.salesByCategory.map((cat) => cat.total_sales), backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"] }]
        }} />} />
       <ChartBox 
  title="ยอดขายตามวันในสัปดาห์" 
  chart={
    <div className="w-full h-60"> {/* ปรับขนาด */}
      <Bar 
        data={{
          labels: chartData.salesByDayOfWeek.map((d) => d.day),
          datasets: [{ label: "ยอดขาย", data: chartData.salesByDayOfWeek.map((d) => typeof d.total_sales === 'object' ? d.total_sales.total_sales : d.total_sales), backgroundColor: "#36A2EB" }]

        }} 
        options={{ maintainAspectRatio: false }} 
      />
    </div>
  } 
/>

<ChartBox title="ยอดขายตามช่วงเวลา" chart={
  <div className="w-full h-60">
    <Pie data={{
      labels: chartData.salesByTimePeriod?.map((p) => p.period) || [],
      datasets: [{
        label: "ยอดขาย",
        data: (chartData.salesByTimePeriod as any[])?.map((p) => p.total_sales) || [],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
      }]
    }} options={{ maintainAspectRatio: false }} />
  </div>
} />

      </div>
    </div>
  );
}

// Component ย่อย
function Card({ title, value, icon }: { title: string; value: number | string; icon: string }) {
  return <div className="bg-white p-4 shadow rounded-lg flex items-center"> <span className="text-2xl mr-3">{icon}</span> <div> <h3 className="text-sm font-semibold">{title}</h3> <p className="text-lg font-bold">{value}</p> </div> </div>;
}

function ChartBox({ title, chart }: { title: string; chart: JSX.Element }) {
  return <div className="bg-white p-4 shadow rounded-lg"> <h2 className="text-sm font-semibold mb-2">{title}</h2> {chart} </div>;
}
