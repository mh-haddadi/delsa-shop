-- ============================================
-- Delsa Shop - Database Schema
-- اجرا: mysql -u root -p < schema.sql
-- ============================================

CREATE DATABASE IF NOT EXISTS delsa_shop
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE delsa_shop;

-- ترتیب ساخت مهمه: اول جدول‌هایی که به جای دیگه اشاره نمی‌کنن

-- 1) categories
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE
);

-- 2) users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3) products  (وابسته به categories)
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  description TEXT,
  price INT NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  image VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- 4) orders  (وابسته به users)
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  status ENUM('pending', 'paid', 'shipped', 'done', 'canceled')
    NOT NULL DEFAULT 'pending',
  total_price INT NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 5) order_items  (وابسته به orders و products)
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ============================================
-- داده نمونه (فقط برای تست)
-- ============================================

INSERT INTO categories (name, slug) VALUES
  ('یکبارمصرف', 'disposable'),
  ('تم تولد', 'birthday');

-- password_hash اینجا فقط placeholder هست؛ توی بک‌اند با bcrypt ساخته می‌شه
INSERT INTO users (name, phone, password_hash, role) VALUES
  ('سارا', '09121234567', 'TEMP_HASH', 'customer'),
  ('مدیر', '09350000000', 'TEMP_HASH', 'admin');

INSERT INTO products (category_id, name, slug, description, price, stock, image) VALUES
  (2, 'بادکنک رنگی', 'colorful-balloon', 'بسته ۱۰ تایی', 6000, 50, '/img/balloon.jpg'),
  (1, 'تک پرس فومی', 'foam-plate', 'بسته ۲۵ تایی', 8000, 200, '/img/plate.jpg'),
  (2, 'کلاه تولد', 'party-hat', 'بسته ۶ تایی', 5000, 30, '/img/hat.jpg');

-- سفارش نمونه: سارا ۳ بادکنک + ۲ تک پرس = 34000
INSERT INTO orders (user_id, total_price, address) VALUES
  (1, 34000, 'کرج، خیابان نمونه');

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
  (1, 1, 3, 6000),
  (1, 2, 2, 8000);

-- ============================================
-- تست: رسید کامل سفارش ۱ (باید همون جدول JOIN رو ببینی)
-- ============================================
-- SELECT o.id AS سفارش, u.name AS مشتری, p.name AS محصول,
--        oi.quantity AS تعداد, oi.unit_price AS قیمت_واحد
-- FROM orders o
-- JOIN users u ON o.user_id = u.id
-- JOIN order_items oi ON oi.order_id = o.id
-- JOIN products p ON oi.product_id = p.id
-- WHERE o.id = 1;
