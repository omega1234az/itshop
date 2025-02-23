"use client"; // สำหรับ Next.js App Router

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Item from "../../components/item";

// สร้าง interfaces สำหรับข้อมูลสินค้าและหมวดหมู่
interface SubCategory {
  sub_category_id: string;
  name: string;
}

interface Category {
  name: string;
}

interface Product {
  product_id: number;
  name: string;
  price: number;
  img: string;
  status:number;
  sub_category_id: string;
  sub_category: SubCategory;
  category: Category;
}

export default function Productlist() {
  const { categories: category_id } = useParams<{ categories: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");
  const [selectedSub, setSelectedSub] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sort, setSort] = useState<string>("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [category_id]);

  const fetchProducts = async () => {
    try {
      let url = `/api/product/categories/${category_id || 1}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch");
      const data: Product[] = await res.json();

      setAllProducts(data);
      setProducts(data);

      const categoryName = data?.[0]?.category?.name || "หมวดหมู่ไม่พบ";
      setCategoryName(categoryName);

      const uniqueSubCategories = Array.from(
        new Set(data.map((p: Product) => p.sub_category_id))
      ).map((id: string) => ({
        sub_category_id: id,
        name: data.find((p: Product) => p.sub_category.sub_category_id === id)?.sub_category?.name || "Unknown",
      }));

      setSubCategories(uniqueSubCategories);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const applyFilters = () => {
    let filteredData = allProducts;

    if (selectedSub) {
      filteredData = filteredData.filter((p: Product) => p.sub_category_id.toString() === selectedSub);
    }

    if (minPrice) {
      filteredData = filteredData.filter((p: Product) => p.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      filteredData = filteredData.filter((p: Product) => p.price <= parseFloat(maxPrice));
    }

    if (sort === "asc") {
      filteredData.sort((a: Product, b: Product) => a.price - b.price);
    } else if (sort === "desc") {
      filteredData.sort((a: Product, b: Product) => b.price - a.price);
    }

    setProducts(filteredData);
  };

  return (
    <div className="container mx-auto px-4">
      {/* Filters Button (Mobile) */}
      <button
        onClick={() => setIsFilterVisible(!isFilterVisible)}
        className="block sm:hidden px-4 py-2 bg-blue-600 mt-3 text-white rounded-lg shadow-md mb-4 transition-all duration-200 hover:bg-blue-700"
      >
        {isFilterVisible ? "ซ่อนตัวกรอง" : "แสดงตัวกรอง"}
      </button>

      {/* Filters */}
      <section
  className={`filters fle container mt-5 w-full flex-col sm:flex-row gap-4 sm:gap-6 mb-6 sm:mb-10 ${isFilterVisible ? "block" : "hidden"} sm:block mx-auto flex justify-center items-center`}
>

        {/* Filter Inputs */}
        <div className="flex flex-col w-full   sm:flex-row gap-4  sm:w-auto justify-center sm:justify-start">
          <select
            value={selectedSub}
            onChange={(e) => setSelectedSub(e.target.value)}
            className="border p-2 rounded-lg w-full sm:w-40 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">เลือกหมวดหมู่</option>
            {subCategories.map((sub) => (
              <option key={sub.sub_category_id} value={sub.sub_category_id}>
                {sub.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="ราคาต่ำสุด"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border p-2 rounded-lg w-full sm:w-40 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            placeholder="ราคาสูงสุด"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border p-2 rounded-lg w-full sm:w-40 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0 w-full sm:w-auto justify-center sm:justify-start">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border p-2 rounded-lg w-full sm:w-40 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">เรียงโดย</option>
            <option value="asc">ราคา : น้อยไปมาก</option>
            <option value="desc">ราคา : มากไปน้อย</option>
          </select>

          <button
            onClick={applyFilters}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg w-full sm:w-auto mt-4 sm:mt-0 shadow-md transition-all duration-200 hover:bg-blue-700"
          >
            ค้นหา
          </button>
        </div>
        </div>

        {/* Sort and Apply Button */}
        
      </section>

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <Item
              key={product.product_id}
              id={product.product_id}
              name={product.name}
              price={product.price}
              img={product.img}
              status={product.status}
            />
          ))
        ) : (
          <p className="col-span-5 text-center text-gray-500">ไม่พบสินค้าที่ค้นหา</p>
        )}
      </div>
    </div>
  );
}
