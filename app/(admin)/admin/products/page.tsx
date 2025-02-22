"use client";

import { useState } from "react";

const data = [
    { id: 1, name: "Banana", category: "Fruit", price: 30 },
    { id: 2, name: "Apple", category: "Fruit", price: 20 },
    { id: 3, name: "Cherry", category: "Fruit", price: 25 },
  ];
  

export default function adminviewproduct(){
  const [items, setItems] = useState(data);
  const [sortBy, setSortBy] = useState("name");
  const [subCategory, setSubCategory] = useState("");
  const [isOpen, setIsOpen] = useState(false); // state สำหรับเปิด-ปิด popup
  const [product, setProduct] = useState({
    name: "CPU",
    stock: 10,
    status: "active",
  });

    // ฟังก์ชันเปิดปิด Popup
    const togglePopup = () => setIsOpen(!isOpen);

    // ฟังก์ชันอัปเดตค่าเมื่อแก้ไข
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setProduct({ ...product, [e.target.name]: e.target.value });
    };


  const handleSort = (sortType: string) => {
    let sortedData = [...items];

    if (sortType === "name") {
      sortedData.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === "category") {
      sortedData.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortType === "price_asc") {
      sortedData.sort((a, b) => a.price - b.price);
    } else if (sortType === "price_desc") {
      sortedData.sort((a, b) => b.price - a.price);
    }

    setItems(sortedData);
    setSortBy(sortType);
  };
    
    return (
        <>
        <div className="flex flex-col">
            <div className="container p-10">
                <div className="flex-1 flex row mb-10">
                    <label className="text-2xl mr-2 font-bold">Sort By :</label>
                    <select
                        value={sortBy}
                        onChange={(e) => handleSort(e.target.value)}
                        className="border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-62 mr-10">
                        <option value="name">Sort by Name (A-Z)</option>
                        <option value="category">Sort by Category</option>
                        <option value="price_asc">Sort by Price (Low to High)</option>
                        <option value="price_desc">Sort by Price (High to Low)</option>
                    </select>

                    {/* Sort by Sub Category Dropdown */}
                    <label className="mr-2 text-2xl font-bold"> Sub Catagory :</label>
                        <select
                            value={subCategory}
                            onChange={(e) => setSubCategory(e.target.value)}
                            className="border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-62">
                            <option value="CPU">CPU</option>
                            <option value="GPU">GPU</option>
                            <option value="RAM">RAM</option>
                        </select>
                </div>
                <div className="flex flex-1 flex-row justify-between mb-10">
                    <div>
                        <div className="border p-5 rounded-lg shadow-lg">
                            <div>
                                <img src="/cpu1.jpg" alt="CPU" width={200} height={200} className="shadow-xl mb-5" />
                            </div>
                            <div className="">
                                <div className="flex flex-1 flex-col">
                                <label>Name: {product.name}</label>
                                <label>Stock: {product.stock}</label>
                                <div className="flex items-center">
                                    <div>Status:</div>
                                    <div className={`w-5 h-5 rounded-full ml-2 ${product.status === "active" ? "bg-teal-400" : "bg-red-400"}`}></div>
                                </div>
                                </div>
                                <div className="flex flex-1 flex-col justify-end ml-20 items-end">
                                <button onClick={togglePopup} className="w-max p-1 bg-[#92E3F1] text-black rounded-lg hover:bg-[#0294BDD9] font-bold">
                                    แก้ไข
                                </button>
                                </div>
                            </div>
                        </div>
                        {isOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-5 rounded-lg shadow-lg w-80">
                            <h2 className="text-xl font-bold mb-3">แก้ไขข้อมูลสินค้า</h2>
                            
                            <label className="block">Name:</label>
                            <input
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            className="w-full border p-2 rounded mb-2"
                            />

                            <label className="block">Stock:</label>
                            <input
                            type="number"
                            name="stock"
                            value={product.stock}
                            onChange={handleChange}
                            className="w-full border p-2 rounded mb-2"
                            />

                            <label className="block">Status:</label>
                            <select
                            name="status"
                            value={product.status}
                            onChange={(e) => setProduct({ ...product, status: e.target.value })}
                            className="w-full border p-2 rounded mb-3"
                            >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            </select>

                            <div className="flex justify-end space-x-2">
                            <button onClick={togglePopup} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                                ยกเลิก
                            </button>
                            <button onClick={togglePopup} className="px-4 py-2 bg-[#92E3F1] text-black rounded-lg hover:bg-[#0294BDD9]">
                                บันทึก
                            </button>
                            </div>
                        </div>
                        </div>
                         )}
                    </div>
                    
                </div>
            </div>
        </div>
        </>
    );
}