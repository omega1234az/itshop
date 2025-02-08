"use client";
import { useEffect, useState } from "react";
import Item from "./components/item";
import Category from "./components/category";

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
  const [products, setProducts] = useState<ProductType[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [topcategories, setTopCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    fetch("/api/product")
      .then((res) => res.json())
      .then((data) => setProducts(data));

    fetch("/api/product/trending")
      .then((res) => res.json())
      .then((data) => setTrendingProducts(data));

    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));

    fetch("/api/categories/top")
      .then((res) => res.json())
      .then((data) => setTopCategories(data));
  }, []);

  return (
    <>
      <div className="container mx-auto px-4 lg:px-0">
        <div className="border-b-2 border-black mt-5"></div>

        {/* Banner */}
        <div className="mt-10">
          <img 
            src="/banner/banner.jpg" 
            alt="" 
            className="h-40 w-full object-cover rounded-lg"
          />
        </div>

        {/* Categories - Scrollable on mobile */}
        <div className="w-full mt-5 overflow-x-auto">
          <div className="flex lg:grid lg:grid-cols-7 gap-4 font-bold min-w-max lg:min-w-0">
            {categories.map((category) => (
              <div className="w-24 lg:w-auto">
                <Category 
                  key={category.category_id} 
                  id={category.category_id} 
                  name={category.name} 
                  img={category.img} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:grid lg:grid-cols-7 gap-4 mt-5 space-y-4 lg:space-y-0">
          {/* Special Offers */}
          <div className="lg:col-span-2 gap-y-2 grid grid-cols-1">
            <div className="bg-teal-400 hover:bg-teal-500 w-full rounded-lg p-3">
              <p className="text-center font-bold w-full text-lg">สินค้าใหม่ ! ! !</p>
            </div>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              {products.slice(-3).map((product) => (
                <Item 
                  key={product.product_id} 
                  id={product.product_id} 
                  name={product.name} 
                  price={product.price} 
                  img={product.img} 
                />
              ))}
            </div>
          </div>

          {/* Trending Products */}
          <div className="lg:col-span-5">
            <div className="bg-teal-400 hover:bg-teal-500 w-full rounded-lg p-3">
              <p className="text-center font-bold w-full text-lg">สินค้ายอดนิยม</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
              {trendingProducts.map((product) => (
                <Item 
                  key={product.product_id} 
                  id={product.product_id} 
                  name={product.name} 
                  price={product.price} 
                  img={product.img} 
                />
              ))}
            </div>

            {/* Top Categories */}
            <div className="mt-5">
              <div className="bg-teal-400 hover:bg-teal-500 w-full rounded-lg p-3 my-3">
                <p className="text-center font-bold w-full text-lg">หมวดหมู่ยอดนิยม</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {topcategories.map((topcategory) => (
                  <Category 
                    key={topcategory.category_id} 
                    id={topcategory.category_id} 
                    name={topcategory.name}  
                    img={topcategory.img} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* All Products */}
        <div className="mt-5">
          <div className="bg-teal-400 hover:bg-teal-500 w-full rounded-lg p-3 mt-3">
            <p className="text-center font-bold w-full text-lg">สินค้าอื่นๆ</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-3">
            {products.map((product) => (
              <Item 
                key={product.product_id} 
                id={product.product_id} 
                name={product.name} 
                price={product.price} 
                img={product.img} 
              />
            ))}
          </div>

          <div className="flex justify-center mt-5">
            <button className="bg-teal-400 hover:bg-teal-500 rounded-lg p-3">
              <p className="text-center font-bold w-48 text-lg">More</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}