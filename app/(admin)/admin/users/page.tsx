export default function adminviewuser() {
    return (
        <div className="flex flex-col p-2">
            <div className="container rounded-lg">
                <h1 className="text-2xl font-semibold p-4 mb-6">จัดการผู้ใช้</h1>
                
                <div className="grid grid-cols-6 gap-4 bg-gray-800 text-white p-2 rounded-md text-center">
                    <span>ID</span>
                    <span>ชื่อ</span>
                    <span>อีเมล</span>
                    <span>ยอดคำสั่งซื้อ</span>
                    <span>ยอดใช้จ่าย</span>
                    <span>จัดการ</span>
                </div>
                
                <div className="divide-y divide-gray-300">
                    {[{ id: 1, name: 'Jhon', email: 'asdzxc@gmail.com', orders: 20, spent: 2000 },
                      { id: 2, name: 'Jhon', email: 'jhon@example.com', orders: 15, spent: 1500 }].map((user, index) => (
                        <div key={index} className="grid grid-cols-6 gap-4 text-center items-center p-2">
                            <span>{user.id}</span>
                            <span>{user.name}</span>
                            <span>{user.email}</span>
                            <span>{user.orders}</span>
                            <span>{user.spent}</span>
                            <button className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition">ลบ</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
