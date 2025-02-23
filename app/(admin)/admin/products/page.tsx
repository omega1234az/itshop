"use client";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import Select from "react-select"; // Import react-select

type Product = {
  product_id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  img: string;
  status: number;
  category: {
    category_id: number;
    name: string;
    description: string;
  };
  sub_category: {
    sub_category_id: number;
    name: string;
    description: string;
  };
};

export default function AdminViewProduct() {
  const [items, setItems] = useState<Product[]>([]);
  const [filteredItems, setFilteredItems] = useState<Product[]>([]); // New state for filtered items
  const [category, setCategory] = useState(""); // For category filter
  const [statusFilter, setStatusFilter] = useState(""); // For status filter

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // Set the number of items per page

  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<Product>({
    product_id: 0,
    name: "",
    description: "",
    price: 0,
    stock: 0,
    img: "",
    status: 1,
    category: { category_id: 0, name: "", description: "" },
    sub_category: { sub_category_id: 0, name: "", description: "" },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/product");
        const data = await response.json();
        setItems(data);
        setFilteredItems(data); // Set the fetched data to filteredItems initially
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, []);

  // Handle category filter change
  const handleCategoryChange = (selectedOption: any) => {
    setCategory(selectedOption?.value || ""); // "all" will set it to ""
  };

  // Handle status filter change
  const handleStatusChange = (selectedOption: any) => {
    setStatusFilter(selectedOption?.value || "");
  };

  // Filter products based on selected filters
  useEffect(() => {
    let filtered = items;

    if (category && category !== "all") {
      filtered = filtered.filter(item => item.category.name === category);
    }

    if (statusFilter) {
      const status = statusFilter === "active" ? 1 : 0;
      filtered = filtered.filter(item => item.status === status);
    }

    setFilteredItems(filtered); // Apply filters to the list
  }, [category, statusFilter, items]);

  // Calculate the products to display for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  const togglePopup = () => setIsOpen(!isOpen);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.name === "stock" || e.target.name === "price"
      ? Number(e.target.value)
      : e.target.value;

    setProduct({ ...product, [e.target.name]: value });
  };

  const handleSubmit = async () => {
    try {
      const updatedData: Partial<Product> = {};
      if (product.name !== "") updatedData.name = product.name;
      if (product.description !== "") updatedData.description = product.description;
      if (product.price !== 0) updatedData.price = Number(product.price);
      if (product.stock !== 0) updatedData.stock = Number(product.stock);
      if (product.img !== "") updatedData.img = product.img;
      if (product.status !== undefined) updatedData.status = product.status;

      const response = await fetch(`/api/admin/product/${product.product_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
        credentials: "include",
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.product_id === updatedProduct.product_id ? updatedProduct : item
          )
        );
        togglePopup();

        Swal.fire({
          icon: 'success',
          title: 'อัปเดตสินค้าแล้ว!',
          text: 'สินค้าได้รับการอัปเดตสำเร็จ',
          confirmButtonColor: '#4BB543',
        });
      } else {
        console.error("Failed to update product.");

        Swal.fire({
          icon: 'error',
          title: 'อุ๊ปส์...',
          text: 'เกิดข้อผิดพลาดในการอัปเดตสินค้า',
          confirmButtonColor: '#FF0000',
        });
      }
    } catch (error) {
      console.error("Error updating product:", error);

      Swal.fire({
        icon: 'error',
        title: 'อุ๊ปส์...',
        text: 'เกิดข้อผิดพลาดที่ไม่คาดคิด',
        confirmButtonColor: '#FF0000',
      });
    }
  };

  // Options for filtering
  const categoryOptions = [
    { value: "all", label: "All" }, // Added "All" option
    { value: "CPU", label: "CPU" },
    { value: "RAM", label: "RAM" },
    { value: "VGA", label: "VGA" },
    { value: "MAINBOARD", label: "MAINBOARD" },
    { value: "SSD", label: "SSD" },
    { value: "Laptop", label: "Laptop" },
    { value: "Monitor", label: "Monitor" },
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  // Pagination logic
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredItems.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="container p-5">
          {/* Filters */}
          <div className="flex gap-4 mb-5">
  <Select
    options={categoryOptions}
    value={categoryOptions.find(option => option.value === category)}
    onChange={handleCategoryChange}
    placeholder="Select Category"
    className="w-1/3"
  />
  <Select
    options={statusOptions}
    value={statusOptions.find(option => option.value === statusFilter)}
    onChange={handleStatusChange}
    placeholder="Select Status"
    className="w-1/3"
  />
  <div className="flex justify-end items-center w-1/3">
    <a
      href=""
      className="px-8 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400 transition duration-200"
    >
      เพิ่มสินค้า
    </a>
  </div>
</div>

          

          {/* Product grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
            {currentItems.map((item) => (
              <div
                key={item.product_id}
                className="border p-4 rounded-lg shadow-lg flex flex-col items-center justify-between" // ปรับขนาดให้เล็กลง
              >
                <div>
                  <img
                    src={item.img}
                    alt={item.name}
                    width={130} // ปรับขนาดของภาพให้เล็กลง
                    height={130} // ปรับขนาดของภาพให้เล็กลง
                    className="shadow-xl mb-4" // ลดระยะห่าง
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="text-sm font-semibold">{item.name}</label> {/* ลดขนาดของชื่อ */}
                  <label className="text-xs text-gray-500">Stock: {item.stock}</label> {/* ลดขนาดของ text */}
                  <div className="flex items-center">
                    <div>Status:</div>
                    <div
                      className={`w-5 h-5 rounded-full ml-2 ${item.status === 1 ? "bg-teal-400" : "bg-red-400"}`}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-center mt-3">
                  <button
                    onClick={() => {
                      setProduct(item);
                      togglePopup();
                    }}
                    className="w-max px-3 py-1 bg-[#92E3F1] text-black rounded-lg hover:bg-[#0294BDD9] font-bold text-xs"
                  >
                    แก้ไข
                  </button>
                </div>
              </div>
            ))}
          </div>


          {/* Pagination */}
          <div className="flex justify-center space-x-2 mt-5">
            {pageNumbers.map(number => (
              <button
                key={number}
                onClick={() => handlePageChange(number)}
                className={`px-4 py-2 border rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
              >
                {number}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-[500px]">
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

            <label className="block">Price:</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-2"
            />

            <label className="block">Description:</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-2"
            />

            <label className="block">Status:</label>
            <select
              name="status"
              value={product.status}
              onChange={(e) => setProduct({ ...product, status: Number(e.target.value) })}
              className="w-full border p-2 rounded mb-3"
            >
              <option value="1">เปิด</option>
              <option value="0">ปิด</option>
            </select>

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleSubmit}
                className="px-8 py-2 bg-teal-400 text-white rounded-lg"
              >
                บันทึก
              </button>
              <button
                onClick={togglePopup}
                className="px-8 py-2 bg-red-400 text-white rounded-lg"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
