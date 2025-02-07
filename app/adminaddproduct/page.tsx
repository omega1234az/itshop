export default function adminaddproduct() {
    return (
        <>
        <div className="flex flex-col">
            <div className="flex flex-1 flex-row justify-between p-10">
                <div className="flex container">
                    <button className="text-black rounded-sm bg-teal-400 hover:bg-teal-500 ml-28 text-2xl font-bold h-[300px] w-[300px] "> Add Picture </button>
                </div>
                <div className="flex container flex-col mr-96">
                    <div className="flex flex-row">
                        <div>
                            <label className="block text-lg font-semibold text-gray-700 mb-2">
                                ราคา
                            </label>
                            <textarea 
                                    placeholder="กรุณากรอกราคาที่นี้"
                                    className="border-2 border-green-500 p-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-64 h-14 resize-none mb-10"
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-semibold text-gray-700 mb-2">
                                จำนวน
                             </label>
                            <textarea 
                                placeholder="กรุณากรอกจำนวนที่นี่"
                                className="border-2 border-green-500 p-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-64 h-14 resize-none"
                            />
                        </div>
                    </div>
                    <div className="flex flex-row">
                        <div>
                            <label className="block text-lg font-semibold text-gray-700 mb-2">
                                หมวดหมู่หลัก
                            </label>
                            <textarea 
                                    placeholder="กรุณากรอกหมวดหมู่หลัก"
                                    className="border-2 border-green-500 p-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-64 h-14 resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-semibold text-gray-700 mb-2">
                                หมวดหมู่รอง
                             </label>
                            <textarea 
                                placeholder="กรุณากรอกหมวดหมู่รองที่นี้"
                                className="border-2 border-green-500 p-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-64 h-14 resize-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-lg font-semibold text-gray-700 mb-2 mt-10">ใส่สเป็ก</label>
                        <textarea 
                            placeholder="กรุณากรอกสเป็กที่นี่"
                            className="border-2 border-green-500 p-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full h-40 resize-none"
                        />
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center">
                <button className="text-black rounded-lg bg-teal-400 hover:bg-teal-500 text-2xl font-bold p-2 w-52">
                    Confirm
                </button>
            </div>
        </div>
        </>
    );
}
