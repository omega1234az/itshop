"use client";

import React, { useState, FormEvent, useEffect } from "react";
// @ts-ignore
import ReCAPTCHA from "react-google-recaptcha";

import Link from "next/link";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const key = `${process.env.NEXT_PUBLIC_SITE_RECAPCHA}`;
  
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
      
      if (data.user.role === "customer") {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error checking session:", error);
    }
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!recaptchaToken) {
      setErrorMessage("โปรดยืนยันว่าคุณไม่ใช่บอท");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, recaptchaToken }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = "/";
      } else {
        setErrorMessage(data.message);
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
        <div className="w-[500px] h-[600px] p-5 border-2 border-gray-300 rounded shadow-md mt-10 bg-gray-300">
          <h2 className="text-center mb-5 text-4xl font-bold">เข้าสู่ระบบ</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-6 text-2xl">
              <label htmlFor="email" className="block mb-1">อีเมล</label>
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
            <div className="mb-6 text-2xl">
              <label htmlFor="password" className="block mb-1">รหัสผ่าน</label>
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
            <div className="flex justify-center my-4">
              <ReCAPTCHA 
                sitekey={key}
                onChange={handleRecaptchaChange} 
              />
            </div>
            <button
              type="submit"
              className="w-60 p-2 text-black rounded-lg bg-teal-400 hover:bg-teal-500 ml-28 text-2xl font-bold"
              disabled={loading}
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "Login"}
            </button>
          </form>
          {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
          <div className="flex justify-between mt-6 text-sm">
            <Link href="/Forgot" className="text-blue-500 hover:underline">ลืมรหัสผ่าน?</Link>
            <Link href="/CreateAcc" className="text-blue-500 hover:underline">สมัครสมาชิก?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
