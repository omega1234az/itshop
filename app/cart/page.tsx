export default function Cart() {
    return (
        <div className="container mx-auto grid grid-cols-3 gap-5 mt-5">
            {/* รายการสินค้า */}
            <div className="col-span-2 overflow-y-scroll max-h-screen h-fit">
                <h2 className="text-lg font-bold mb-3">ตะกร้าสินค้า</h2>
                <div className="border-b-2 border-black mb-3"></div>

                <div className="grid grid-cols-2 items-center border p-4 rounded-lg shadow-md ">
                    <img className="w-40" src="/cpu1.jpg" alt="CPU" />
                    <div>
                        <p className="font-semibold">CPU (ซีพียู) AMD RYZEN 5 7600X 4.7 GHz (SOCKET AM5)</p>
                        <p className="text-red-500 font-bold mt-2">ราคา 5000.-</p>
                    </div>
                    
                </div>
                <div className="grid grid-cols-2 items-center border p-4 rounded-lg shadow-md ">
                    <img className="w-40" src="/cpu1.jpg" alt="CPU" />
                    <div>
                        <p className="font-semibold">CPU (ซีพียู) AMD RYZEN 5 7600X 4.7 GHz (SOCKET AM5)</p>
                        <p className="text-red-500 font-bold mt-2">ราคา 5000.-</p>
                    </div>
                    
                </div>
                <div className="grid grid-cols-2 items-center border p-4 rounded-lg shadow-md ">
                    <img className="w-40" src="/cpu1.jpg" alt="CPU" />
                    <div>
                        <p className="font-semibold">CPU (ซีพียู) AMD RYZEN 5 7600X 4.7 GHz (SOCKET AM5)</p>
                        <p className="text-red-500 font-bold mt-2">ราคา 5000.-</p>
                    </div>
                    
                </div>
                
                
                
                
            </div>

            {/* สรุปยอดรวม */}
            <div className="col-span-1 bg-gray-100 p-5 rounded-lg shadow-md h-fit">
                <h2 className="text-lg font-bold mb-3">สรุปยอดรวม</h2>
                <div className="border-b-2 border-black mb-3"></div>

                <div className="flex justify-between mb-2">
                    <span>ยอดรวม:</span>
                    <span className="font-bold">15000.-</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>จำนวน:</span>
                    <span className="font-bold">3</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>ค่าจัดส่ง:</span>
                    <span className="font-bold">ฟรี</span>
                </div>

                <div className="flex justify-between border-t pt-2 font-bold text-lg">
                    <span>รวมทั้งหมด:</span>
                    <span>5000.-</span>
                </div>

                <button className="w-full bg-blue-500 text-white py-2 mt-4 rounded-lg hover:bg-blue-600 transition duration-200">
                    ดำเนินการสั่งซื้อ
                </button>
            </div>
        </div>
    );
}
