"use client";
import { useEffect, useState } from "react";
import Item from "./components/item";
import Category from "./components/category";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [topcategories, setTopCategories] = useState([]);

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
    fetch("/api/categories/top")
      .then((res) => res.json())
      .then((data) => setTopCategories(data));
  }, []);

  return (
    <>
      <div className="container mx-auto">
        <div className="border-b-2 border-black mt-5"></div>

        <div className="h-5 w-full grid grid-cols-5 gap-4 justify-items-stretch mt-8 font-bold">
          <button className="bg-teal-400 hover:bg-teal-500 p-2 w-full rounded-lg">
            Trending Product
          </button>
          <button className="bg-teal-400 hover:bg-teal-500 rounded-lg">
            Special Offers
          </button>
          <button className="bg-teal-400 hover:bg-teal-500 rounded-lg">PC</button>
          <button className="bg-teal-400 hover:bg-teal-500 rounded-lg">RAM</button>
          <button className="bg-teal-400 hover:bg-teal-500 rounded-lg">VGA</button>
        </div>

        <div className="mt-10">
          <img src="/banner/banner.jpg" alt="" className="h-40 w-full object-cover" />
        </div>

        <div className="w-full grid grid-cols-7 gap-4 font-bold mt-5">
        {categories.map((categories) => (
                <Category key={categories.category_id} id={categories.category_id} name={categories.name} price={categories.price}  img={categories.img}/>
              ))}
        </div>

        <div className="grid grid-cols-7 gap-4 mt-5">
          {/* Special Offers (คงที่) */}
          <div className="col-span-2 gap-y-2 grid grid-cols-1">
            <button className="bg-teal-400 hover:bg-teal-500 w-full rounded-lg p-3">
              <p className="text-center font-bold w-full text-lg">Special Offers</p>
            </button>
            <Item name="Amd" price={20} />
            <Item name="Amd" price={20} />
            <Item name="Amd" price={20} />
          </div>

          {/* Trending Products */}
          <div className="col-span-5">
            <button className="bg-teal-400 hover:bg-teal-500 w-full rounded-lg p-3">
              <p className="text-center font-bold w-full text-lg">Trending Product</p>
            </button>
            <div className="grid grid-cols-4 gap-2">
              {trendingProducts.map((product) => (
                <Item key={product.product_id} id={product.product_id} name={product.name} price={product.price} />
              ))}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <button className="bg-teal-400 hover:bg-teal-500 w-full rounded-lg p-3 col-span-3 mt-3">
                <p className="text-center font-bold w-full text-lg">Top Category</p>
              </button>
              {topcategories.map((topcategories) => (
                <Category key={topcategories.category_id} id={topcategories.category_id} name={topcategories.name} price={topcategories.price}  img={topcategories.img}/>
              ))}
            </div>
          </div>
        </div>

        {/* All Products */}
        <div className="grid grid-cols-6 gap-3">
          <button className="col-span-6 bg-teal-400 hover:bg-teal-500 w-full rounded-lg p-3 mt-3">
            <p className="text-center font-bold w-full text-lg">More Items</p>
          </button>

          {products.map((product) => (
            <Item key={product.product_id} id={product.product_id} name={product.name} price={product.price} />
          ))}

          <button className="col-span-6 bg-teal-400 hover:bg-teal-500 w-fit mx-auto rounded-lg p-3 mt-3">
            <p className="text-center font-bold w-48 text-lg">More</p>
          </button>
        </div>
      </div>
    </>
  );
}
