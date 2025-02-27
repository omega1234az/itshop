"use client";
import React, { useEffect, useState } from 'react';
import { Upload, X, ImagePlus, DollarSign, Package2, Layers, ListPlus } from 'lucide-react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router'
import { redirect } from 'next/dist/server/api-utils';

interface SubCategory {
  sub_category_id: number;
  name: string;
  description: string;
  category_id: number;
  created_at: string;
}

interface Category {
  category_id: number;
  name: string;
  description: string;
  created_at: string;
  img: string;
  view_count: number;
  sub_categories: SubCategory[];
}

export default function AdminAddProduct() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/categories/')
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'ไม่สามารถโหลดข้อมูลหมวดหมู่ได้',
          text: 'โปรดรีเฟรชหน้าจอเพื่อลองใหม่',
          confirmButtonColor: '#6366F1'
        });
      });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: 'warning',
          title: 'ไฟล์ขนาดใหญ่เกินไป',
          text: 'ขนาดไฟล์ต้องไม่เกิน 5MB',
          confirmButtonColor: '#6366F1'
        });
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setStock('');
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!name || !description || !price || !stock || !selectedCategory || !selectedSubCategory || !image) {
      Swal.fire({
        icon: 'error',
        title: 'ข้อมูลไม่ครบ',
        text: 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
        confirmButtonColor: '#6366F1'
      });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('category_id', selectedCategory.toString());
    formData.append('sub_category_id', selectedSubCategory.toString());
    formData.append('img', image);

    try {
      const response = await fetch('/api/admin/product', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'เพิ่มสินค้าสำเร็จ',
          text: 'คุณต้องการเพิ่มสินค้าต่อหรือไม่?',
          showCancelButton: true,
          confirmButtonText: 'เพิ่มต่อ',
          cancelButtonText: 'เสร็จสิ้น',
          confirmButtonColor: '#6366F1',
          cancelButtonColor: '#94A3B8'
        }).then((result) => {
          if (result.isConfirmed) {
            resetForm();
            
          }
         else {
          // เจาะจงไปที่ /product เมื่อกด "เสร็จสิ้น"
          window.location.replace('products');
        }
          
        });
      } else {
        throw new Error();
      }
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'ไม่สามารถเพิ่มสินค้าได้',
        text: 'โปรดลองใหม่อีกครั้ง',
        confirmButtonColor: '#6366F1'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-fit min-h-fit bg-gray-50 p-4">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">เพิ่มสินค้าใหม่</h1>
          <p className="mt-1 text-gray-600">กรอกข้อมูลสินค้าใหม่ลงในฟอร์มด้านล่าง</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Form */}
          <div className="lg:col-span-8 space-y-4">
            {/* Basic Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Package2 className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-semibold text-gray-900">ข้อมูลพื้นฐาน</h2>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อสินค้า</label>
                  <input
                    type="text"
                    placeholder="กรุณากรอกชื่อสินค้า"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียดสินค้า</label>
                  <textarea
                    placeholder="กรุณากรอกรายละเอียดสินค้า"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors h-28 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-semibold text-gray-900">ราคา & จำนวนสินค้า</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ราคา</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">฿</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนสินค้า</label>
                  <input
                    type="number"
                    placeholder="กรอกจำนวนสินค้า"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Categories Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-semibold text-gray-900">หมวดหมู่</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่หลัก</label>
                  <select
                    value={selectedCategory ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedCategory(value ? parseInt(value) : null);
                      setSelectedSubCategory(null);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  >
                    <option value="">เลือกหมวดหมู่</option>
                    {categories.map((category) => (
                      <option key={category.category_id} value={category.category_id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่ย่อย</label>
                  <select
                    value={selectedSubCategory ?? ''}
                    onChange={(e) => setSelectedSubCategory(e.target.value ? parseInt(e.target.value) : null)}
                    disabled={!selectedCategory}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors disabled:bg-gray-50"
                  >
                    <option value="">เลือกหมวดหมู่ย่อย</option>
                    {selectedCategory &&
                      categories
                        .find((c) => c.category_id === selectedCategory)
                        ?.sub_categories.map((sub) => (
                          <option key={sub.sub_category_id} value={sub.sub_category_id}>
                            {sub.name}
                          </option>
                        ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            {/* Image Upload Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-4">
                <ImagePlus className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-semibold text-gray-900">รูปภาพสินค้า</h2>
              </div>

              <div className="space-y-3">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full aspect-square rounded-lg object-cover"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="block">
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer">
                      <Upload className="mx-auto h-10 w-10 text-gray-400" />
                      <p className="mt-1 text-sm text-gray-600">คลิกหรือลากไฟล์เพื่ออัพโหลด</p>
                      <p className="text-xs text-gray-500">ขนาดสูงสุด: 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Action Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-4">
                <ListPlus className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-semibold text-gray-900">การดำเนินการ</h2>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-3 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'กำลังเพิ่มสินค้า...' : 'เพิ่มสินค้า'}
                </button>

                <button
                  onClick={resetForm}
                  className="w-full py-2.5 px-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 focus:ring-4 focus:ring-gray-200/50 transition-colors"
                >
                  รีเซ็ตฟอร์ม
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
