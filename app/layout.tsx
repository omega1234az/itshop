import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from './components/Header'
import { Kanit } from 'next/font/google'

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "300"],
});


export const metadata: Metadata = {
  title: "หน้าแรก",
  description: "จำหน่ายสินค้า IT ทุกชนิด",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <html lang="en">
      
      <body
        className={kanit.className}
      >
        <Header></Header>
        {children}
      </body>
    </html>
  );
}
