"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Swal from 'sweetalert2';

interface UserData {
  name: string;
  
  phone: string;
  address: string;
  img?: string;
}

interface OrderData {
  id: number;
  productName: string;
  date: string;
}

export default function ManageAcc() {
  const [userData, setUserData] = useState<UserData>({
    name: "",
    
    phone: "",
    address: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("ไม่สามารถดึงข้อมูลโปรไฟล์ได้");
        }

        const data: UserData = await response.json();
        setUserData({
          name: data.name,
          
          phone: data.phone,
          address: data.address,
        });
        
        if (data.img) {
          setPreview(data.img);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  };



  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Show loading state
    Swal.fire({
      title: 'กำลังอัปเดตข้อมูล...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    try {
      const formData = new FormData();
      
      Object.entries(userData).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });
  
      if (file) {
        formData.append('file', file);
      }
  
      const response = await fetch("/api/auth/me/edit", {
        method: "PUT",
        credentials: "include",
        body: formData,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
      }
  
      // Show success message
      await Swal.fire({
        icon: 'success',
        title: 'สำเร็จ!',
        text: 'อัปเดตข้อมูลเรียบร้อยแล้ว',
        confirmButtonText: 'ตกลง',
        timer: 1500,
        timerProgressBar: true
      });
  
      // Reload page after success
      window.location.reload();
  
    } catch (error) {
      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด!',
        text: error instanceof Error ? error.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
        confirmButtonText: 'ตกลง'
      });
    }
  };

  // Mock order data
  const orders: OrderData[] = [
    { id: 1, productName: "Example Product 1", date: "2025-01-16" },
    { id: 2, productName: "Example Product 2", date: "2025-01-16" },
    { id: 3, productName: "Example Product 3", date: "2025-01-16" },
  ];

  if (isLoading) return <div>กำลังโหลดข้อมูล...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col">
      <div className="flex-1 flex flex-row p-10">
        <div className="container border-solid border-gray-700 border-r-4 flex flex-col items-start h-auto w-[500px]">
          <h1 className="text-2xl font-bold mb-5">Quick</h1>
          <ul className="list-disc pl-6 space-y-2">
            <li className="text-xl text-gray-700">
              <a href="" className="hover:text-blue-500">Item 1</a>
            </li>
            <li className="text-xl text-gray-700">
              <a href="" className="hover:text-blue-500">Item 2</a>
            </li>
            <li className="text-xl text-gray-700">
              <a href="" className="hover:text-blue-500">Item 3</a>
            </li>
            <li className="text-xl text-gray-700">
              <a href="" className="hover:text-blue-500">Item 4</a>
            </li>
          </ul>
        </div>
        <div className="w-full max-w-4xl p-5">
          <h2 className="text-2xl font-bold mb-5">Account Management</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block mb-2">Profile Image</label>
              <div className="flex items-center space-x-4">
                {preview && (
                  <img 
                    src={preview} 
                    alt="Profile preview" 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="border border-gray-300 rounded p-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <label htmlFor="name" className="block mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block mb-1">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={userData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="address" className="block mb-1">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={userData.address}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              บันทึกข้อมูล
            </button>
          </form>

          <h3 className="text-xl font-bold mb-3 mt-8">Order History</h3>
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="flex justify-between items-center p-3 bg-blue-100 rounded">
                <div>
                  <p className="text-sm">Order ID: {order.id}</p>
                  <p className="text-sm">Product Name: {order.productName}</p>
                  <p className="text-sm">Date: {order.date}</p>
                </div>
                <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 border-solid border-2 border-[#0294BD5C]">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}