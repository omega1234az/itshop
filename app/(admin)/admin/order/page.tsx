"use client";
import { useState, useEffect } from "react";
import { Package2, FileText } from "lucide-react";

interface Product {
    product_name: string;
    quantity: number;
    price: number;
    img: string;
    product: Product;
}

interface Order {
    order_id: number;
    status: string;
    user: {
        email: string;
        name: string;
    };
    address: string;
    order_details: Product[];
    order_date: string; // Add the order_date field
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "pending":
            return "bg-yellow-100 text-yellow-800";   // Pending: yellow
        case "processing":
            return "bg-blue-100 text-blue-800";       // Processing: blue
        case "completed":
            return "bg-teal-100 text-teal-800";       // Completed: teal
        case "cancelled":
            return "bg-red-100 text-red-800";         // Cancelled: red
        default:
            return "bg-gray-100 text-gray-800";       // Default: gray
    }
};

const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
        pending: "รอชำระเงิน",
        cancelled: "ยกเลิก",
        processing: "กำลังจัดส่ง",
        completed: "จัดส่งแล้ว"
    };
    return statusMap[status] || status;
};

export default function AdminViewOrder() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filterStatus, setFilterStatus] = useState("ทั้งหมด");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [newStatus, setNewStatus] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const [sortOption, setSortOption] = useState("none");

    useEffect(() => {
        const fetchOrders = async () => {
            const response = await fetch("/api/admin/order");
            const data = await response.json();
            setOrders(data);
        };
        fetchOrders();
    }, []);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(e.target.value);
    };

    const filteredOrders = filterStatus === "ทั้งหมด"
        ? orders
        : orders.filter(order => order.status === filterStatus);

    const sortedOrders = () => {
        switch (sortOption) {
            case "asc":
                return [...filteredOrders].sort((a, b) => new Date(a.order_date).getTime() - new Date(b.order_date).getTime());
            case "desc":
                return [...filteredOrders].sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime());
            default:
                return filteredOrders;
        }
    };

    const updateOrderStatus = async (orderId: number) => {
        try {
            const response = await fetch(`/api/admin/order/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.order_id === orderId ? { ...order, status: newStatus } : order
                    )
                );
                setSelectedOrder(null);
            }
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    const indexOfLastOrder = currentPage * rowsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - rowsPerPage;
    const currentOrders = sortedOrders().slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(sortedOrders().length / rowsPerPage);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Package2 className="h-6 w-6" />
                        จัดการคำสั่งซื้อ
                    </h1>
                    <div className="flex gap-4">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border rounded-lg shadow-sm bg-white"
                        >
                            <option value="ทั้งหมด">แสดงทั้งหมด</option>
                            <option value="pending">รอชำระเงิน</option>
                            <option value="processing">กำลังจัดส่ง</option>
                            <option value="completed">จัดส่งแล้ว</option>
                            <option value="cancelled">ยกเลิก</option>
                        </select>

                        <select
                            value={sortOption}
                            onChange={handleSortChange}
                            className="px-4 py-2 border rounded-lg shadow-sm bg-white"
                        >
                            <option value="none">ไม่มีการเรียงลำดับ</option>
                            <option value="asc">เรียงจากเก่าที่สุด</option>
                            <option value="desc">เรียงจากใหม่ที่สุด</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">อีเมล</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ที่อยู่</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รายการสินค้า</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentOrders.map((order) => (
                                <tr key={order.order_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">#{order.order_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                                            {getStatusText(order.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate">{order.address}</td>
                                    <td className="px-6 py-4 max-w-xs truncate">
                                        {order.order_details.map(item => `${item.product_name} (x${item.quantity})`).join(', ')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                setNewStatus(order.status);
                                            }}
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            <FileText className="h-4 w-4 mr-2" />
                                            ดูรายละเอียด
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 flex items-center justify-between border-t">
                    <div className="text-sm text-gray-500">
                        แสดง {indexOfFirstOrder + 1} ถึง {Math.min(indexOfLastOrder, filteredOrders.length)} จาก {filteredOrders.length} รายการ
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            ก่อนหน้า
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            ถัดไป
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                รายละเอียดคำสั่งซื้อ #{selectedOrder.order_id}
                            </h2>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Close</span>
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Customer Info */}
                            <div>
                                <h3 className="font-semibold mb-2">ข้อมูลลูกค้า</h3>
                                <p className="text-sm">{selectedOrder.user.email}</p>
                                <p className="text-sm text-gray-500">{selectedOrder.address}</p>
                            </div>

                            <hr className="my-4" />

                            {/* Order Items */}
                            <div>
                                <h3 className="font-semibold mb-2">รายการสินค้า</h3>
                                <div className="space-y-2">
                                    {selectedOrder.order_details.map((detail, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <img
                                                src={detail.product.img}
                                                alt={detail.product_name}
                                                className="w-12 h-12 rounded-md object-cover"
                                            />
                                            <div>
                                                <p className="text-sm font-medium">{detail.product_name}</p>
                                                <p className="text-sm text-gray-500">
                                                    จำนวน: {detail.quantity} | ราคา: {detail.price.toLocaleString()} บาท
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <hr className="my-4" />

                            {/* Status Update */}
                            <div>
                                <h3 className="font-semibold mb-2">อัพเดทสถานะ</h3>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                >
                                    <option value="processing">กำลังจัดส่ง</option>
                                    <option value="completed">จัดส่งแล้ว</option>
                                    <option value="cancelled">ยกเลิก</option>
                                </select>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 justify-end mt-6">
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={() => updateOrderStatus(selectedOrder.order_id)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    บันทึกการเปลี่ยนแปลง
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
