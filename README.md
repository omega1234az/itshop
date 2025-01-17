ITShop

📌 รายละเอียดโครงการ

ITShop เป็นระบบร้านค้าออนไลน์สำหรับจำหน่ายสินค้าไอที โดยมีฟีเจอร์หลักดังนี้:

🛍 ระบบจัดการสินค้า

🛒 ระบบสั่งซื้อสินค้า

👤 ระบบสมาชิก

💳 ระบบชำระเงิน

🚚 ระบบติดตามคำสั่งซื้อ

🛠 เทคโนโลยีที่ใช้

Frontend: Next.js , Tailwind CSS

Backend: Node.js, Express.js, MySQL

Authentication: JWT

Styling: Tailwind CSS, SweetAlert2

📂 โครงสร้างโฟลเดอร์

ITShop/
├── backend/              # โค้ดฝั่งเซิร์ฟเวอร์
│   ├── controllers/      # จัดการ API
│   ├── middleware/       # จัดการ Middleware
│   ├── routers/         # เส้นทาง API
│   ├── db/              # การเชื่อมต่อฐานข้อมูล
│   ├── app.js           # ไฟล์เริ่มต้นเซิร์ฟเวอร์
├── frontend/             # โค้ดฝั่งลูกค้า
│   ├── components/      # ส่วนประกอบ UI
│   ├── pages/           # หน้าต่าง ๆ ของเว็บ
│   ├── store/           # Vuex/Pinia store
│   ├── assets/          # ไฟล์รูปภาพ ไอคอน ฯลฯ
│   ├── nuxt.config.js   # การตั้งค่า Nuxt.js
├── README.md             # คำอธิบายโครงการ
├── package.json          # รายการ dependencies

🚀 วิธีการติดตั้งและใช้งาน

1️⃣ Clone โปรเจค

git clone https://github.com/your-repo/ITShop.git
cd ITShop

2️⃣ ติดตั้ง dependencies

cd backend
npm install
cd ../frontend
npm install

3️⃣ ตั้งค่าฐานข้อมูล

สร้างฐานข้อมูล MySQL และตั้งค่าการเชื่อมต่อใน backend/db/connection.js

4️⃣ รันโปรเจค

▶️ ฝั่ง Backend

cd backend
npm start

▶️ ฝั่ง Frontend

cd frontend
npm run dev

👨‍💻 ผู้จัดทำ

66026167

66022882

66022826

