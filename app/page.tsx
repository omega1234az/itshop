"use client";
import { useEffect, useState } from "react";
import Item from "./components/item";
import Category from "./components/category";

// สร้าง interface สำหรับ Category และ Product
interface CategoryType {
  category_id: number;
  name: string;
  img: string;
}

interface ProductType {
  product_id: number;
  name: string;
  price: number;
  img: string;
}

export default function Home() {
  const [products, setProducts] = useState<ProductType[]>([]); // กำหนด type เป็น ProductType[]
  const [trendingProducts, setTrendingProducts] = useState<ProductType[]>([]); // กำหนด type เป็น ProductType[]
  const [categories, setCategories] = useState<CategoryType[]>([]); // กำหนด type เป็น CategoryType[]
  const [topcategories, setTopCategories] = useState<CategoryType[]>([]); // กำหนด type เป็น CategoryType[]

  useEffect(() => {
    // ดึงข้อมูลสินค้าทั้งหมด
    fetch("/api/product")
      .then((res) => res.json())
      .then((data) => setProducts(data));

    // ดึงข้อมูลสินค้ายอดนิยม
    fetch("/api/product/trending")
      .then((res) => res.json())
      .then((data) => setTrendingProducts(data));

    // ดึงหมวดหมู่สินค้า
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));

    // ดึงหมวดหมู่สินค้าชั้นนำ
    fetch("/api/categories/top")
      .then((res) => res.json())
      .then((data) => setTopCategories(data));
  }, []);

  return (
    <>
      <div className="container mx-auto">
        <div className="border-b-2 border-black mt-5"></div>

        <div className="mt-10">
          <img src="/banner/banner.jpg" alt="" className="h-40 w-full object-cover" />
        </div>

        <div className="w-full grid grid-cols-7 gap-4 font-bold mt-5">
          {categories.map((category) => (
            <Category key={category.category_id} id={category.category_id} name={category.name} img={category.img} />
          ))}
        </div>

        <div className="grid grid-cols-7 gap-4 mt-5">
          {/* Special Offers (คงที่) */}
          <div className="col-span-2 gap-y-2 grid grid-cols-1">
            <div className="bg-teal-400 hover:bg-teal-500 w-full rounded-lg p-3">
              <p className="text-center font-bold w-full text-lg">สินค้าใหม่ ! ! !</p>
            </div>
            {products.slice(-3).map((product) => (
              <Item key={product.product_id} id={product.product_id} name={product.name} price={product.price} img={product.img} />
            ))}
          </div>

          {/* Trending Products */}
          <div className="col-span-5">
            <div className="bg-teal-400 hover:bg-teal-500 w-full rounded-lg p-3">
              <p className="text-center font-bold w-full text-lg">สินค้ายอดนิยม</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {trendingProducts.map((product) => (
                <Item key={product.product_id} id={product.product_id} name={product.name} price={product.price} img={product.img} />
              ))}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="bg-teal-400 hover:bg-teal-500 w-full rounded-lg p-3 col-span-3 my-3">
                <p className="text-center font-bold w-full text-lg ">หมวดหมู่ยอดนิยม</p>
              </div>
              {topcategories.map((topcategory) => (
                <Category key={topcategory.category_id} id={topcategory.category_id} name={topcategory.name}  img={topcategory.img} />
              ))}
            </div>
          </div>
        </div>

        {/* All Products */}
        <div className="grid grid-cols-6 gap-3">
          <div className="col-span-6 bg-teal-400 hover:bg-teal-500 w-full rounded-lg p-3 mt-3">
            <p className="text-center font-bold w-full text-lg">สินค้าอื่นๆ</p>
          </div>

          {products.map((product) => (
            <Item key={product.product_id} id={product.product_id} name={product.name} price={product.price} img={product.img} />
          ))}

          <button className="col-span-6 bg-teal-400 hover:bg-teal-500 w-fit mx-auto rounded-lg p-3 mt-3">
            <p className="text-center font-bold w-48 text-lg">More</p>
          </button>
        </div>
      </div>
    </>
  );
}
