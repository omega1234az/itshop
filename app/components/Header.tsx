"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";

interface User {
  user_id: number;
  name: string;
  email: string;
  img?: string;
  role?: string;
}

interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  img: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!res.ok) return;
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchCartCount() {
      if (!user) return;
      try {
        const res = await fetch("/api/cart", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-User-ID": String(user.user_id),
          },
        });

        if (!res.ok) return;
        const data = await res.json();
        setCartCount(data.length);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    }

    fetchCartCount();
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    async function searchProducts() {
      try {
        const res = await fetch(`/api/search/${searchQuery}`);
        const data = await res.json();
        if (data.success) {
          setSearchResults(data.data.slice(0, 5));
        }
      } catch (error) {
        console.error("Error searching products:", error);
      }
    }

    searchProducts();
  }, [searchQuery]);

  return (
    <div className="w-full bg-white shadow-md">
      {/* Desktop Header */}
      <div className="hidden lg:block">
        <div className="container mx-auto grid grid-cols-10 text-center items-center gap-5 relative py-4">
          <a href="\" className="mt-2">
          <img src="\banner\logo.png" alt="" />
          </a>
          <a href="/contact" className="font-bold">ติดต่อ</a>

          <div className="col-span-5 relative">
            <input
              className="w-full border border-black p-2 rounded-lg"
              placeholder="ค้นหา"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            {searchQuery && searchResults.length > 0 && (
              <div className="absolute left-0 top-full w-full bg-white shadow-lg p-4 mt-2 rounded-md z-10">
                {searchResults.map((product) => (
                  <a
                    key={product.product_id}
                    href={`/productdetail/${product.product_id}`}
                    className="flex items-center space-x-2 py-2 hover:bg-gray-100"
                  >
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-12 h-12 object-cover"
                    />
                    <div className="text-left text-sm">
                      <h4 className="font-semibold">{product.name}</h4>
                      <p>{product.description}</p>
                      <p className="text-red-600">฿{product.price.toLocaleString()}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          <a href="/productlist">
            <img src="/icon/search.png" alt="search" className="cursor-pointer" />
          </a>

          <a href="/cart" className="ml-auto pr-10 relative">
            <img src="/icon/cart.png" alt="cart" className="cursor-pointer w-7" />
            {cartCount > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {cartCount}
              </span>
            )}
          </a>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-14 h-14 mt-2 rounded-full border border-gray-300 overflow-hidden"
              >
                <img
                  src={user?.img}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-48 z-10">
                  <ul>
                    {user.role === 'admin' && (
                      <li>
                        <a
                          href="/admin/dashboard"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        >
                          Admin Dashboard
                        </a>
                      </li>
                    )}
                    <li>
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        โปรไฟล์
                      </a>
                    </li>
                    <li>
                      <a
                        href="/order"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        คำสั่งซื้อของฉัน
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={async () => {
                          await fetch("/api/auth/logout", { method: "POST" });
                          window.location.reload();
                        }}
                        className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <a className="bg-teal-400 hover:bg-teal-500 rounded-lg p-2 font-bold" href="/login">
              Login
            </a>
          )}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              <Menu size={24} />
            </button>
            
            <a href="/" className="bg-red-400 p-3">Logo</a>

            <div className="flex items-center space-x-4">
              <a href="/cart" className="relative">
                <img src="/icon/cart.png" alt="cart" className="w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {cartCount}
                  </span>
                )}
              </a>

              {user ? (
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-10 h-10 rounded-full border border-gray-300 overflow-hidden"
                >
                  <img
                    src={user?.img}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </button>
              ) : (
                <a className="bg-teal-400 hover:bg-teal-500 rounded-lg px-3 py-1 text-sm font-bold" href="/login">
                  Login
                </a>
              )}
            </div>
          </div>

          {/* Mobile Search */}
          <div className="mt-3">
            <input
              className="w-full border border-black p-2 rounded-lg"
              placeholder="ค้นหา"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="mt-3 border-t pt-3">
              <nav className="space-y-3">
                <a href="/contact" className="block font-bold">ติดต่อ</a>
                <a href="/productlist" className="block">สินค้าทั้งหมด</a>
              </nav>
            </div>
          )}

          {/* Mobile Search Results */}
          {searchQuery && searchResults.length > 0 && (
            <div className="mt-2 bg-white shadow-lg p-4 rounded-md">
              {searchResults.map((product) => (
                <a
                  key={product.product_id}
                  href={`/productdetail/${product.product_id}`}
                  className="flex items-center space-x-2 py-2 hover:bg-gray-100"
                >
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-12 h-12 object-cover"
                  />
                  <div className="text-left text-sm">
                    <h4 className="font-semibold">{product.name}</h4>
                    <p>{product.description}</p>
                    <p className="text-red-600">฿{product.price.toLocaleString()}</p>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Mobile Profile Dropdown */}
          {dropdownOpen && user && (
            <div className="mt-3 bg-white border rounded-lg shadow-lg">
              <ul>
                {user.role === 'admin' && (
                  <li>
                    <a
                      href="/admin/dashboard"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </a>
                  </li>
                )}
                <li>
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <button
                    onClick={async () => {
                      await fetch("/api/auth/logout", { method: "POST" });
                      window.location.reload();
                    }}
                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}