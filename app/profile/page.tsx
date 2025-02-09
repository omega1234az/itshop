"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Swal from 'sweetalert2';

interface UserData {
  name: string;
  phone: string;
  address: string;
  img?: string;
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

      await Swal.fire({
        icon: 'success',
        title: 'สำเร็จ!',
        text: 'อัปเดตข้อมูลเรียบร้อยแล้ว',
        confirmButtonText: 'ตกลง',
        timer: 1500,
        timerProgressBar: true
      });

      window.location.reload();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด!',
        text: error instanceof Error ? error.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
        confirmButtonText: 'ตกลง'
      });
    }
  };

  if (isLoading) return <div>กำลังโหลดข้อมูล...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col container mx-auto px-4">
      <div className="flex flex-row p-8 justify-center">
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-5 text-center">จัดการโปรไฟล์</h2>
          <form onSubmit={handleSubmit}>
            {/* Profile Image */}
            <div className="mb-6 flex items-center justify-center">
              {preview && (
                <img 
                  src={preview} 
                  alt="Profile preview" 
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 mb-4"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border border-gray-300 rounded p-2"
              />
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label htmlFor="name" className="block mb-1 font-medium">ชื่อ</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block mb-1 font-medium">เบอร์โทรศัพท์</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={userData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label htmlFor="address" className="block mb-1 font-medium">ที่อยู่</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={userData.address}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button 
                type="submit" 
                className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
              >
                บันทึกข้อมูล
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
