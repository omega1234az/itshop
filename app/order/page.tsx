"use client";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { loadStripe } from '@stripe/stripe-js';

const key = `${process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}`;
const stripePromise = loadStripe(key);

interface ProductData {
  product_id: number;
  name: string;
  price: number;
  img: string;
}

interface OrderDetail {
  order_detail_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: ProductData;
}

interface Payment {
  session_id: string;
}

interface OrderData {
  order_id: number;
  user_id: number;
  total_price: number;
  status: "pending" | "processing" | "completed" | "failed";
  payment_status: "pending" | "completed" | "failed";
  order_date: string;
  address: string;
  total_order_price: number;
  order_details: OrderDetail[];
  payments: Payment[];
}

interface ApiResponse {
  orders: OrderData[];
}

export default function ManageAcc() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isOrderLoading, setIsOrderLoading] = useState<boolean>(true);
  const [orderError, setOrderError] = useState<string | null>(null);
  
  const [selectedTab, setSelectedTab] = useState<string>("pending");  // กำหนดแท็บเริ่มต้น

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/auth/me/order", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("ไม่สามารถดึงข้อมูลคำสั่งซื้อได้");
        }

        const data: ApiResponse = await response.json();
        setOrders(data.orders);
      } catch (error) {
        setOrderError(error instanceof Error ? error.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ");
      } finally {
        setIsOrderLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filterOrdersByStatus = (status: string) => {
    return orders.filter(order => order.status === status);
  };

  const handlePayment = async (sessionId: string | undefined) => {
    if (!sessionId) {
      Swal.fire("Error", "ไม่พบข้อมูลการชำระเงิน", "error");
      return;
    }

    const stripe = await stripePromise;

    if (!stripe) {
      Swal.fire("Error", "ไม่สามารถเชื่อมต่อกับ Stripe ได้", "error");
      return;
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      Swal.fire("Error", error.message || "เกิดข้อผิดพลาดในการชำระเงิน", "error");
    }
  };

  return (
    <div className="flex flex-col container mx-auto px-4">
      {/* แสดงแท็บให้เลือก */}
      <div className="mb-6 border-b border-gray-300 flex">
        {["pending", "processing", "completed", "failed"].map((status) => (
          <button
            key={status}
            className={`w-full py-2 text-lg font-medium text-gray-600 focus:outline-none transition duration-300 ease-in-out 
              ${selectedTab === status ? 'border-b-4 border-blue-500 text-blue-600' : 'hover:text-blue-500'}`}
            onClick={() => setSelectedTab(status)}
          >
            {status === "pending" ? "รอชำระเงิน" : 
             status === "processing" ? "กำลังจัดส่ง" :
             status === "completed" ? "จัดส่งสำเร็จ" :
             "ยกเลิก"}
          </button>
        ))}
      </div>

      <h3 className="text-xl font-bold mb-3 mt-8">ประวัติการสั่งซื้อ</h3>

      <div className="space-y-3">
        {isOrderLoading ? (
          <div>กำลังโหลดข้อมูลคำสั่งซื้อ...</div>
        ) : orderError ? (
          <div>{orderError}</div>
        ) : (
          <div className="space-y-4">
            {filterOrdersByStatus(selectedTab).length === 0 ? (
              <div className="text-center text-gray-500">ไม่พบคำสั่งซื้อในสถานะนี้</div>
            ) : (
              filterOrdersByStatus(selectedTab).map((order) => (
                <div key={order.order_id} className="p-4 bg-white rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm font-medium">คำสั่งซื้อ #{order.order_id}</p>
                      <p className="text-sm text-gray-600">{formatDate(order.order_date)}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                      {order.status === 'completed' ? "จัดส่งสำเร็จ" :
                       order.status === 'processing' ? "กำลังจัดส่ง" :
                       order.status === 'pending' ? "รอชำระเงิน" :
                       "ยกเลิก"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.order_details.map((detail) => (
                      <div key={detail.order_detail_id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div className="flex items-center space-x-3">
                          <img
                            src={detail.product.img}
                            alt={detail.product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium">{detail.product.name}</p>
                            <p className="text-sm text-gray-600">จำนวน: {detail.quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium">฿{detail.price.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex justify-between items-center pt-3 border-t">
                    <div>
                      <p className="text-sm text-gray-600">ที่อยู่จัดส่ง: {order.address}</p>
                      <p className="text-sm font-medium">รวมทั้งสิ้น: ฿{order.total_price.toLocaleString()}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.payment_status)}`}>
                      {order.payment_status === 'completed' ? 'ชำระเงินแล้ว' : 
                       order.payment_status === 'pending' ? 'รอชำระเงิน' : 'การชำระเงินล้มเหลว'}
                    </div>
                  </div>

                  {/* แสดงปุ่มชำระเงินเฉพาะคำสั่งซื้อที่สถานะ 'pending' */}
                  {order.payment_status === 'pending' && order.payments.length > 0 && (
                    <button
                      onClick={() => handlePayment(order.payments[0].session_id)}
                      className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg"
                    >
                      ชำระเงิน
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
