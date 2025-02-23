"use client";

import { useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

// ✅ ฟังก์ชันสร้างข้อมูลย้อนหลังเป็นเดือน
const generateMonthlyData = (months: number) => {
  const today = new Date();
  return Array.from({ length: months }).map((_, i) => {
    const date = new Date();
    date.setMonth(today.getMonth() - i);
    return {
      name: date.toLocaleDateString("th-TH", { month: "short", year: "2-digit" }),
      GPU: Math.floor(Math.random() * 10000),
      CPU: Math.floor(Math.random() * 8000),
      RAM: Math.floor(Math.random() * 6000),
      SSD: Math.floor(Math.random() * 7000),
      Mainboard: Math.floor(Math.random() * 5000),
      Case: Math.floor(Math.random() * 4000),
    };
  }).reverse();
};

const generateHourlyData = () => {
    return ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"].map(time => ({
      name: time,
      GPU: Math.floor(Math.random() * 10000),
      CPU: Math.floor(Math.random() * 8000),
      RAM: Math.floor(Math.random() * 6000),
      SSD: Math.floor(Math.random() * 7000),
      Mainboard: Math.floor(Math.random() * 5000),
      Case: Math.floor(Math.random() * 4000),
    }));
  };

export default function Dashboard() {
  const [selectedType, setSelectedType] = useState("รายได้");
  const [selectedTime, setSelectedTime] = useState("1เดือน");
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
  const [showLineChart, setShowLineChart] = useState(true);
  const [showBarChart, setShowBarChart] = useState(true);

  const data = {
    รายได้: {
      "1วัน": generateHourlyData(),
      "1อาทิตย์": generateMonthlyData(7),
      "1เดือน": generateMonthlyData(30),
      "1ปี": generateMonthlyData(12),
    },
    จำนวนการเข้าชม: {
      "1วัน": generateHourlyData(),
      "1อาทิตย์": generateMonthlyData(7),
      "1เดือน": generateMonthlyData(30),
      "1ปี": generateMonthlyData(12),
    },
  };

  const filteredData = data[selectedType][selectedTime];

  const categories = ["Mainboard", "GPU", "CPU", "RAM", "SSD", "Case"];
  const categoryColors: Record<string, string> = {
    GPU: "#FF5733",
    CPU: "#33FF57",
    RAM: "#3357FF",
    SSD: "#FF33A6",
    Mainboard: "#FFA533",
    Case: "#A633FF",
  };

  // ✅ แก้ไขฟังก์ชันคำนวณผลรวม
  const calculateTotal = (): number => {
    if (!filteredData) return 0;
    return filteredData.reduce((sum: number, day: Record<string, number | string>) => {
      if (selectedCategory === "ทั้งหมด") {
        return sum + categories.reduce((subSum, key) => subSum + (Number(day[key]) || 0), 0);
      } else {
        return sum + (Number(day[selectedCategory]) || 0);
      }
    }, 0);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">รายงานยอดขาย</h1>

      <div className="flex space-x-4 mb-6">
        <select className="border p-2 rounded" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <option value="รายได้">รายได้</option>
          <option value="จำนวนการเข้าชม">จำนวนการเข้าชม</option>
        </select>

        <select className="border p-2 rounded" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
          <option value="1วัน">1 วัน</option>
          <option value="1อาทิตย์">1 อาทิตย์</option>
          <option value="1เดือน">1 เดือน</option>
          <option value="1ปี">1 ปี</option>
        </select>

        <select className="border p-2 rounded" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="ทั้งหมด">ทั้งหมด</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="text-lg font-semibold mb-4">
        {`รวมของ ${selectedCategory === "ทั้งหมด" ? "ทุกประเภท" : selectedCategory} ในช่วง ${selectedTime} คือ ${calculateTotal().toLocaleString()}`}
      </div>

      <div className="flex space-x-4 mb-6">
        <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => setShowLineChart(!showLineChart)}>
          {showLineChart ? "ปิด" : "เปิด"} กราฟเส้น
        </button>
        <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => setShowBarChart(!showBarChart)}>
          {showBarChart ? "ปิด" : "เปิด"} กราฟแท่ง
        </button>
      </div>

      {showLineChart && (
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Legend />
              {selectedCategory === "ทั้งหมด"
                ? categories.map((cat) => (
                    <Line key={cat} type="monotone" dataKey={cat} stroke={categoryColors[cat]} strokeWidth={2} />
                  ))
                : <Line type="monotone" dataKey={selectedCategory} stroke={categoryColors[selectedCategory]} strokeWidth={3} />}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {showBarChart && (
        <div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Legend />
              {selectedCategory === "ทั้งหมด"
                ? categories.map((cat) => (
                    <Bar key={cat} dataKey={cat} fill={categoryColors[cat]} />
                  ))
                : <Bar dataKey={selectedCategory} fill={categoryColors[selectedCategory]} />}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
