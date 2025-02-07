"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from 'next/navigation';
import Swal from "sweetalert2";

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
        Swal.fire({
          title: "เพิ่มสินค้าเข้าตะกร้าแล้ว!",
          icon: "success",
          confirmButtonText: "ตกลง",
        });
      } else {
        Swal.fire({
          title: "เกิดข้อผิดพลาด!",
          text: "ไม่สามารถเพิ่มสินค้าเข้าตะกร้าได้",
          icon: "error",
          confirmButtonText: "ลองอีกครั้ง",
        });
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
    <div className="container mx-auto px-4 py-10">
      {/* Product Image & Description Section */}
      <div className="flex flex-col lg:flex-row items-center space-y-10 lg:space-y-0">
        <div className="flex-shrink-0">
          <img
            src={product.img}
            alt={product.name}
            className="w-80 h-80 object-contain rounded-lg shadow-xl border-2 border-gray-300"
          />
        </div>
        <div className="lg:ml-10 space-y-6">
          <h1 className="text-4xl font-extrabold text-gray-800">{product.name}</h1>
          
          {/* Product Info (หมวดหมู่, แบรนด์, สต็อก, ยอดขาย) */}
          <div className="text-lg text-gray-700 space-y-2">
            <p>หมวดหมู่: {product.category.name}</p>
            <p>แบรนด์: {product.sub_category.name}</p>
            
            
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-teal-600">{product.price.toLocaleString()} บาท</h2>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <button
              className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300"
              onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
            >
              -
            </button>
            <span className="px-4 py-2 text-lg border rounded-full">{quantity}</span>
            <button
              className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300"
              onClick={() => setQuantity((prev) => Math.min(prev + 1, product.stock))}
            >
              +
            </button>
            <p>คงเหลือ : {product.stock} ชิ้น</p>
          </div>
          

          {/* Add to Cart and Buy Now Buttons */}
          <div className="mt-5 flex items-center space-x-4">
  <button
    onClick={handleAddToCart}
    className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg shadow-md transition ease-in-out duration-300 transform hover:scale-105"
  >
    Add to Cart
  </button>
  <button
    onClick={handleBuyNow}
    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md transition ease-in-out duration-300 transform hover:scale-105"
  >
    ซื้อเลย
  </button>
  <p className="text-lg">ขายแล้ว : {product.total_sales} ชิ้น</p>
</div>

          
        </div>
      </div>

      {/* Product Description Section */}
      <div className="mt-10">
        <p className="text-xl text-gray-600">Product Description:</p>
        <div className="w-full h-48 p-4 border-2 border-gray-300 rounded-lg shadow-md overflow-auto">
          <p className="text-sm text-gray-700">{product.description}</p>
        </div>
      </div>
    </div>
  );
}
