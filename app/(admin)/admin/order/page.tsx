"use client";
import { useState } from "react";
import Swal from "sweetalert2";

// Define the type for the order
type Order = {
  id: number;
  orderNumber: string;
  customer: string;
  status: string;
  total: number;
};

const mockOrderDetails = [
  { productName: "สินค้าตัวอย่าง 1", quantity: 2, price: 500 },
  { productName: "สินค้าตัวอย่าง 2", quantity: 1, price: 700 },
  { productName: "สินค้าตัวอย่าง 3", quantity: 3, price: 300 },
];

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([
    { id: 1, orderNumber: "ORD12345", customer: "John Doe", status: "รอชำระเงิน", total: 1200 },
    { id: 2, orderNumber: "ORD12346", customer: "Jane Smith", status: "กำลังจัดส่ง", total: 2500 },
    { id: 3, orderNumber: "ORD12347", customer: "Michael Lee", status: "จัดส่งสำเร็จ", total: 1800 },
    { id: 4, orderNumber: "ORD12348", customer: "Emily Davis", status: "ยกเลิก", total: 2200 },
  ]);

  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);

  // ฟังก์ชั่นสำหรับการแสดง popup แก้ไขสถานะ
  const handleEditOrder = async (order: Order) => {  // Add type here
    const productsHtml = mockOrderDetails.map((item) => `
      <div class="flex justify-between mb-2">
        <span><strong>${item.productName}</strong></span>
        <span>จำนวน: ${item.quantity} ชิ้น - ฿${item.price}</span>
      </div>
    `).join("");

    Swal.fire({
      title: `<strong>แก้ไขสถานะออเดอร์ #${order.orderNumber}</strong>`,
      html: `
        <div class="text-lg mb-3">
          <p><strong>ลูกค้า:</strong> ${order.customer}</p>
          <p><strong>ยอดรวม:</strong> ฿${order.total}</p>
          <h3 class="mt-4 text-xl">รายละเอียดสินค้า:</h3>
          <div class="mt-2">${productsHtml}</div>
        </div>
      `,
      input: "select",
      inputOptions: {
        "Pending": "รอชำระเงิน",
        "Shipped": "กำลังจัดส่ง",
        "Delivered": "จัดส่งแล้ว",
        "Cancel": "ยกเลิก",
      },
      inputPlaceholder: "เลือกสถานะ",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "บันทึกการเปลี่ยนแปลง",
      focusConfirm: false,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      customClass: {
        popup: 'bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full',
        title: 'text-center font-bold text-xl mb-4 text-blue-600',
        htmlContainer: 'text-lg text-gray-700',
        input: 'w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500',
        confirmButton: 'bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700',
        cancelButton: 'bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newStatus = result.value;
        // อัพเดตสถานะออเดอร์
        setOrders((prevOrders) =>
          prevOrders.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o))
        );
        Swal.fire("สำเร็จ", "สถานะออเดอร์ถูกเปลี่ยนแปลงแล้ว", "success");
      }
    });
  };

  // ฟังก์ชั่นสำหรับกรองออเดอร์ตามสถานะ
  const filterOrders = (status: string) => { // Specify the type of `status` parameter
    if (status === "All") {
      setFilteredOrders(orders); // ถ้ากรองเป็นทั้งหมด
    } else {
      setFilteredOrders(orders.filter(order => order.status === status));
    }
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-3">จัดการออเดอร์</h1>

      {/* ตัวเลือกสถานะ */}
      <div className="grid grid-cols-5 gap-4 mb-4">
        <button
          onClick={() => filterOrders("รอชำระเงิน")}
          className="bg-gray-300 p-2 rounded"
        >
          รอชำระเงิน
        </button>
        <button
          onClick={() => filterOrders("กำลังจัดส่ง")}
          className="bg-gray-300 p-2 rounded"
        >
          กำลังจัดส่ง
        </button>
        <button
          onClick={() => filterOrders("จัดส่งแล้ว")}
          className="bg-gray-300 p-2 rounded"
        >
          จัดส่งแล้ว
        </button>
        <button
          onClick={() => filterOrders("ยกเลิก")}
          className="bg-gray-300 p-2 rounded"
        >
          ยกเลิก
        </button>
        <button
          onClick={() => filterOrders("All")}
          className="bg-gray-300 p-2 rounded"
        >
          ทั้งหมด
        </button>
      </div>

      {/* ตารางแสดงรายการออเดอร์ */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">เลขออเดอร์</th>
              <th className="px-4 py-2">ลูกค้า</th>
              <th className="px-4 py-2">สถานะ</th>
              <th className="px-4 py-2">ยอดรวม</th>
              <th className="px-4 py-2">จัดการ</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="px-4 py-2">{order.orderNumber}</td>
                <td className="px-4 py-2">{order.customer}</td>
                <td className="px-4 py-2">{order.status}</td>
                <td className="px-4 py-2">฿{order.total}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEditOrder(order)}
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                  >
                    แก้ไขสถานะ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
