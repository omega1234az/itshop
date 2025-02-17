"use client";
import { useState } from "react";
import Swal from "sweetalert2";
// @ts-ignore
import ReCAPTCHA from "react-google-recaptcha";  // นำเข้า ReCAPTCHA

export default function CreateAcc() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const key = `${process.env.NEXT_PUBLIC_SITE_RECAPCHA}`;
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  // ระบุชนิดของ e ให้เป็น React.ChangeEvent<HTMLInputElement>
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ฟังก์ชันที่ใช้สำหรับ reCAPTCHA
  const handleRecaptcha = (token: string | null) => {
    setRecaptchaToken(token);
  };

  // ระบุชนิดของ e ให้เป็น React.FormEvent<HTMLFormElement>
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      Swal.fire("Error", "รหัสผ่านไม่ตรงกัน", "error");
      return;
    }

    if (!recaptchaToken) {
      Swal.fire("Error", "โปรดยืนยัน reCAPTCHA", "error");
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          recaptchaToken: recaptchaToken,  // ส่ง token ไปกับ request
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "ไม่สามารถสมัครสมาชิกได้");
      }

      Swal.fire("สำเร็จ!", "สมัครสมาชิกเรียบร้อย", "success");
      window.location.href = "/login";
    } catch (error) {
      if (error instanceof Error) {
        Swal.fire("เกิดข้อผิดพลาด", error.message, "error");
      } else {
        Swal.fire("เกิดข้อผิดพลาด", "ไม่ทราบข้อผิดพลาด", "error");
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex-1 flex justify-center items-center mt-10">
        <div className="w-[500px] h-auto p-5 border border-gray-300 rounded shadow-md bg-gray-300">
          <h2 className="text-center mb-5 text-4xl font-bold">Create your Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6 text-2xl">
              <label htmlFor="name" className="block mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-600 text-gray-200"
                required
              />
            </div>
            <div className="mb-6 text-2xl">
              <label htmlFor="email" className="block mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-600 text-gray-200"
                required
              />
            </div>
            <div className="mb-6 text-2xl">
              <label htmlFor="password" className="block mb-1">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-600 text-gray-200"
                required
              />
            </div>
            <div className="mb-6 text-2xl">
              <label htmlFor="confirmPassword" className="block mb-1">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-600 text-gray-200"
                required
              />
            </div>
            
            {/* reCAPTCHA Component */}
            <div className="mb-6">
              <ReCAPTCHA
                sitekey={key}  // เปลี่ยนเป็น Site Key ของคุณ
                onChange={handleRecaptcha}
              />
            </div>

            <button
              type="submit"
              className="w-[250px] p-2 text-black rounded-lg bg-teal-400 hover:bg-teal-500 text-3xl font-bold ml-[108px]"
            >
              Confirm
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
