"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
// @ts-ignore
import ReCAPTCHA from "react-google-recaptcha";

export default function CreateAcc() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    otp: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const key = `${process.env.NEXT_PUBLIC_SITE_RECAPCHA}`;
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  // New states for countdown timer
  const [timer, setTimer] = useState<number>(0); // In seconds
  const [isOtpButtonDisabled, setIsOtpButtonDisabled] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRecaptcha = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const sendOtp = async () => {
    if (!formData.phone) {
      Swal.fire("กรุณากรอกข้อมูล", "โปรดกรอกเบอร์โทรศัพท์ก่อนส่ง OTP", "warning");
      return;
    }

    try {
      const response = await fetch("/api/otp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formData.phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "ไม่สามารถส่ง OTP ได้");
      }

      Swal.fire("สำเร็จ!", "OTP ถูกส่งไปยังเบอร์ของคุณแล้ว", "success");

      // Start the countdown timer for OTP button (30 seconds)
      setTimer(30);
      setIsOtpButtonDisabled(true);
    } catch (error) {
      if (error instanceof Error) {
        Swal.fire("เกิดข้อผิดพลาด", error.message, "error");
      } else {
        Swal.fire("เกิดข้อผิดพลาด", "ไม่ทราบข้อผิดพลาด", "error");
      }
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      // Enable OTP button after the countdown finishes
      setIsOtpButtonDisabled(false);
    }

    // Clean up interval when component unmounts or when the timer reaches 0
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          recaptchaToken: recaptchaToken,
          phone: formData.phone,
          otp: formData.otp,
        }),
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
      <div className="flex-1 flex justify-center items-center mt-6">
        <div className="w-[450px] p-4 border border-gray-300 rounded shadow-md bg-gray-300">
          <h2 className="text-center mb-4 text-3xl font-bold">สมัครสมาชิก</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="name" className="block mb-1 text-lg">ชื่อ</label>
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
            
            <div>
              <label htmlFor="email" className="block mb-1 text-lg">อีเมล</label>
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
            
            <div>
              <label htmlFor="password" className="block mb-1 text-lg">รหัสผ่าน</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-600 text-gray-200 pr-10"
                  required
                />
                <div 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-gray-300" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    {showPassword ? (
                      <g>
                        <path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </g>
                    ) : (
                      <g>
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </g>
                    )}
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block mb-1 text-lg">ยืนยันรหัสผ่าน</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-600 text-gray-200 pr-10"
                  required
                />
                <div 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-gray-300" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    {showConfirmPassword ? (
                      <g>
                        <path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </g>
                    ) : (
                      <g>
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </g>
                    )}
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2 items-end">
              <div className="col-span-3">
                <label htmlFor="phone" className="block mb-1 text-lg">เบอร์โทรศัพท์</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-600 text-gray-200"
                  required
                />
              </div>
              <button
                type="button"
                onClick={sendOtp}
                className="p-2 bg-teal-400 hover:bg-teal-500 text-black rounded-lg font-bold"
                disabled={isOtpButtonDisabled}
              >
                {isOtpButtonDisabled ? `${timer} s` : "ส่ง OTP"}
              </button>
            </div>

            <div>
              <label htmlFor="otp" className="block mb-1 text-lg">OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-600 text-gray-200"
                required
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="w-full p-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-bold"
              >
                สมัครสมาชิก
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
