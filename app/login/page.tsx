"use client";

import React, { useState, FormEvent, useEffect } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next/client';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const SESSION_EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000; // 7 วันในมิลลิวินาที

  // ตรวจสอบ session เมื่อโหลดคอมโพเนนต์
  useEffect(() => {
    checkSession();
  }, []);

  // แยกฟังก์ชันตรวจสอบ session ออกมา
  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/check-session', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      });
      const data = await res.json();

      if (data.isLoggedIn) {
        console.log('✅ Session Active:', data.session_id);
        window.location.href = '/'; // ถ้ามี session ให้ redirect ไปหน้าหลัก
      } else {
        console.log('🚫 No Active Session');
        // ถ้าไม่มี session ให้ redirect ไปหน้า login
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Cookies.set('session_id', data.session_id, {
          expires: 7,
          path: '/'
        });
        Cookies.set('session_timestamp', Date.now().toString(), {
          expires: 7,
          path: '/'
        });

        // ใช้ window.location.href สำหรับการ redirect หลังจาก login สำเร็จ
        window.location.href = '/';
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex justify-center items-center">
        <div className="w-150 h-auto p-5 border border-gray-300 rounded shadow-md">
          <h2 className="text-center mb-5 text-3xl font-bold">Login To your Account</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-12 text-xl">
              <label htmlFor="email" className="block mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg h-[53px]"
              />
            </div>
            <div className="mb-12 text-xl">
              <label htmlFor="password" className="block mb-1">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg h-[53px]"
              />
            </div>
            <button
              type="submit"
              className="w-60 p-2 bg-[#0294BDD9] text-black rounded-lg hover:bg-blue-500 ml-48 text-xl font-bold"
              disabled={loading}
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'Login'}
            </button>
            {errorMessage && (
              <div className="mt-3 text-red-500 text-xl text-center">{errorMessage}</div>
            )}
          </form>
          <div className="flex justify-between mt-4 text-sm">
            <Link href="/Forgot" className="text-blue-500 hover:underline">Forgot Password?</Link>
            <Link href="/CreateAcc" className="text-blue-500 hover:underline">Create Account?</Link>
          </div>
        </div>
      </div>

      <footer className="bg-[#0000004D] p-3 h-[150px] border border-gray-300 flex flex-row justify-between">
        <div className="flex gap-4 mb-2 ml-10 mt-5">
          <img src="../logo.jpg" alt="logo" className="h-[68px] w-[96px]" />
          <h2 className="text-2xl text-[#F5F5F5]">ชำระด้วย</h2>
          <img src="../mastercard.jpg" alt="MasterCard" className="h-[40px] w-[40px]" />
          <img src="../kplus.jpg" alt="K+" className="h-[40px] w-[40px]" />
        </div>
        <div className="flex flex-row justify-between mr-10 mt-5">
          <h1 className="text-2xl text-[#F5F5F5]">เชื่อมต่อกับเรา</h1>
          <a href="#" className="ml-10">
            <img src="../Facebook.jpg" alt="facebook" className="h-[40px] w-[40px]" />
          </a>
          <a href="#" className="ml-10">
            <img src="../ig.jpg" alt="instagram" className="h-[40px] w-[40px]" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Login;