# ใช้ Node.js เป็น base image
FROM node:18-alpine

# ตั้ง working directory ใน container
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json เพื่อทำการติดตั้ง dependencies
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์ทั้งหมดในโปรเจคไปยัง container
COPY . .

# Build โปรเจค Next.js สำหรับ production
RUN npm run build

# เปิดพอร์ตที่ Next.js จะรัน (โดยปกติคือ 3000)
EXPOSE 3000

# เริ่มต้นแอปพลิเคชัน
CMD ["npm", "start"]
