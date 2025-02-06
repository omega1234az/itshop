"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from 'next/navigation';

export default function ProductDetail() {
  const router = useRouter();
  const param = useParams<{ id: string }>();
  const id = param.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // จำนวนสินค้าที่จะซื้อ

  useEffect(() => {
    if (id) {
      fetch(`/api/product/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching product:", err);
          setLoading(false);
        });
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.product_id,
          quantity,
        }),
      });

      if (response.ok) {
        alert("เพิ่มสินค้าเข้าตะกร้าแล้ว!");
      } else {
        alert("เกิดข้อผิดพลาดในการเพิ่มสินค้า");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart(); // เพิ่มเข้าตะกร้า
    router.push("/cart"); // ไปหน้าตะกร้า
  };

  if (loading) {
    return <p className="text-center mt-10 text-lg">กำลังโหลดข้อมูล...</p>;
  }

  if (!product) {
    return <p className="text-center mt-10 text-lg text-red-500">ไม่พบสินค้านี้</p>;
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex-1 flex flex-row justify-center container mt-10">
          <div className="ml-48 mr-auto">
            <img
              src={product.img}
              alt={product.name}
              className="w-72 object-cover mx-auto border-1 border-gray-300 shadow-lg rounded-lg"
            />
          </div>
          <div className="mr-96">
            <h1 className="font-bold text-4xl mb-5">{product.name}</h1>
            <h1 className="text-xl font-semibold text-gray-700">Product Description:</h1>
            <div className="w-96 h-48 mt-5 p-3 border-2 border-gray-300 rounded-lg shadow-md">
              <h1 className="text-base break-words">{product.description}</h1>
            </div>
            <div>
              <h1 className="mt-5 font-bold text-2xl">{product.price.toLocaleString()} บาท</h1>
            </div>

            {/* ปุ่มเพิ่ม/ลดจำนวนสินค้า */}
            <div className="flex items-center mt-4">
              <button
                className="px-3 py-1 bg-gray-300 rounded-l"
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
              >
                -
              </button>
              <span className="px-5 py-1 border">{quantity}</span>
              <button
                className="px-3 py-1 bg-gray-300 rounded-r"
                onClick={() => setQuantity((prev) => Math.min(prev + 1, product.stock))}
              >
                +
              </button>
            </div>

            {/* ปุ่มเพิ่มเข้าตะกร้า */}
            <button
              onClick={handleAddToCart}
              className="mt-3 bg-teal-400 hover:bg-teal-500 p-2 rounded-lg font-semibold"
            >
              Add to Cart
            </button>

            {/* ปุ่มซื้อเลย */}
            <button
              onClick={handleBuyNow}
              className="mt-3 ml-3 bg-orange-500 hover:bg-orange-600 p-2 rounded-lg font-semibold text-white"
            >
              ซื้อเลย
            </button>
          </div>
        </div>

        <div className="ml-48 mt-20">
          <h1 className="font-semibold text-3xl">สเป็กเครื่อง</h1>
          <p>หมวดหมู่: {product.category.name}</p>
          <p>แบรนด์: {product.sub_category.name}</p>
          <p>สต็อก: {product.stock} ชิ้น</p>
          <p>ยอดขาย: {product.total_sales} ชิ้น</p>
        </div>
      </div>
    </>
  );
}
