"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import Link from "next/link";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      if (data.role == "admin") {
        window.location.href = "/admin/dashboard";
      } else if (data.role == "customer") {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error checking session:", error);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.user.role == "admin") {
        window.location.href = "/admin/dashboard";
      } else if (data.user.role == "customer") {
        window.location.href = "/";
      }
    } catch (error) {
      setErrorMessage("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex-1 flex justify-center items-center">
        <div className="w-[500px] h-[500px] p-5 border-2 border-gray-300 rounded shadow-md mt-10 bg-gray-300">
          <h2 className="text-center mb-5 text-4xl font-bold">Login To your Account</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-12 text-2xl">
              <label htmlFor="email" className="block mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg h-[53px] bg-gray-600 text-gray-200"
                required
              />
            </div>
            <div className="mb-12 text-2xl">
              <label htmlFor="password" className="block mb-1">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg h-[53px] bg-gray-600 text-gray-200"
                required
              />
            </div>
            <button
              type="submit"
              className="w-60 p-2 bg-[#92E3F1] text-black rounded-lg hover:bg-[#0294BDD9] ml-28 text-2xl font-bold border-solid border-2 border-[#0294BD5C]"
              disabled={loading}
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "Login"}
            </button>
          </form>
          {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
          <div className="flex justify-between mt-14 text-sm">
            <Link href="/Forgot" className="text-blue-500 hover:underline">Forgot Password?</Link>
            <Link href="/CreateAcc" className="text-blue-500 hover:underline">Create Account?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
