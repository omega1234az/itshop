"use client"; // สำหรับ Next.js App Router

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "./productlist.css";
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
  sub_category_id: string;
  sub_category: SubCategory;
  category: Category;
}

export default function Productlist() {
  const { categories: category_id } = useParams<{ categories: string }>();
  const [products, setProducts] = useState<Product[]>([]); // ใช้ประเภท Product[]
  const [allProducts, setAllProducts] = useState<Product[]>([]); // ใช้ประเภท Product[]
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]); // ใช้ประเภท SubCategory[]
  const [categoryName, setCategoryName] = useState<string>(""); // ชื่อของหมวดหมู่
  const [selectedSub, setSelectedSub] = useState<string>(""); // Subcategory ที่เลือก
  const [minPrice, setMinPrice] = useState<string>(""); // ราคาต่ำสุด
  const [maxPrice, setMaxPrice] = useState<string>(""); // ราคาสูงสุด
  const [sort, setSort] = useState<string>(""); // เรียงลำดับ

  useEffect(() => {
    fetchProducts();
  }, [category_id]);

  const fetchProducts = async () => {
    try {
      let url = `/api/product/categories/${category_id || 1}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch");
      const data: Product[] = await res.json(); // ระบุประเภทของข้อมูลให้ TypeScript ทราบ

      setAllProducts(data);
      setProducts(data);

      // ตั้งชื่อหมวดหมู่
      const categoryName = data?.[0]?.category?.name || "หมวดหมู่ไม่พบ";
      setCategoryName(categoryName);

      // ดึง subcategories จากสินค้าที่ได้
      const uniqueSubCategories = Array.from(
        new Set(data.map((p: Product) => p.sub_category_id)) // ใช้ประเภท Product
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

    // กรองตาม Subcategory
    if (selectedSub) {
      filteredData = filteredData.filter((p: Product) => p.sub_category_id.toString() === selectedSub);
    }

    // กรองราคาต่ำสุด
    if (minPrice) {
      filteredData = filteredData.filter((p: Product) => p.price >= parseFloat(minPrice));
    }

    // กรองราคาสูงสุด
    if (maxPrice) {
      filteredData = filteredData.filter((p: Product) => p.price <= parseFloat(maxPrice));
    }

    // เรียงลำดับ
    if (sort === "asc") {
      filteredData.sort((a: Product, b: Product) => a.price - b.price);
    } else if (sort === "desc") {
      filteredData.sort((a: Product, b: Product) => b.price - a.price);
    }

    setProducts(filteredData);
  };

  return (
    <div className="App container mx-auto">
      {/* Filters */}
      <div className="w-full text-center mb-4">
        <h2>หมวดหมู่: {categoryName}</h2>
      </div>
      <section className="filters flex gap-4 mb-4">
        <select value={selectedSub} onChange={(e) => setSelectedSub(e.target.value)}>
          <option value="">เลือก หมวดหมู่</option>
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
        />
        <input
          type="number"
          placeholder="ราคาสูงสุด"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">เรียงโดย</option>
          <option value="asc">ราคา : น้อยไปมาก</option>
          <option value="desc">ราคา : มากไปน้อย</option>
        </select>
        <button onClick={applyFilters} className="px-4 py-2 bg-blue-500 text-white rounded">
          ค้นหา
        </button>
      </section>

      {/* Product List */}
      <div className="w-full grid grid-cols-5 gap-5">
        {products.length > 0 ? (
          products.map((product) => (
            <Item key={product.product_id} id={product.product_id} name={product.name} price={product.price} img={product.img} />
          ))
        ) : (
          <p className="col-span-5 text-center">No products found</p>
        )}
      </div>
    </div>
  );
}
