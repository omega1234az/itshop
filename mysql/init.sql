-- สร้างฐานข้อมูล
CREATE DATABASE IF NOT EXISTS itshop;
USE itshop;

-- 🔹 ตารางผู้ใช้ (Users) พร้อมกับฟิลด์ total_spent
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    address TEXT,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_spent DECIMAL(10,2) DEFAULT 0  -- ยอดรวมที่ผู้ใช้ใช้จ่าย
);

-- 🔹 ตารางหมวดหมู่สินค้า (Categories) พร้อมกับฟิลด์ view_count
CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    view_count INT DEFAULT 0  -- จำนวนการดูหมวดหมู่
);

-- 🔹 ตารางหมวดหมู่ย่อยสินค้า (Sub Categories)
CREATE TABLE sub_categories (
    sub_category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

-- 🔹 ตารางสินค้า (Products) พร้อมกับฟิลด์ view_count, total_sales, total_revenue
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    category_id INT,
    sub_category_id INT,
    img VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    view_count INT DEFAULT 0,  -- จำนวนการดูสินค้า
    total_sales INT DEFAULT 0,  -- จำนวนสินค้าที่ขายได้
    total_revenue DECIMAL(10,2) DEFAULT 0,  -- ยอดขายรวม
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    FOREIGN KEY (sub_category_id) REFERENCES sub_categories(sub_category_id) ON DELETE SET NULL
);

-- 🔹 ตารางคำสั่งซื้อ (Orders) พร้อมกับฟิลด์ total_order_price
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'paid', 'shipped', 'delivered', 'canceled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_order_price DECIMAL(10,2) DEFAULT 0,  -- ยอดรวมคำสั่งซื้อ
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 🔹 ตารางรายละเอียดคำสั่งซื้อ (Order Details)
CREATE TABLE order_details (
    order_detail_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- 🔹 ตารางชำระเงิน (Payments)
CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    user_id INT,
    payment_method ENUM('credit_card', 'paypal', 'bank_transfer', 'cash_on_delivery') NOT NULL,
    payment_status ENUM('pending', 'successful', 'failed', 'refunded') DEFAULT 'pending',
    transaction_id VARCHAR(100) UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 🔹 ตารางตะกร้าสินค้า (Cart)
CREATE TABLE cart (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    product_id INT,
    quantity INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);
