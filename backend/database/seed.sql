-- ============================================
-- Delsa Shop - Initial Seed Data
-- اجرا پس از schema.sql:
-- mysql -u root -p delsa_shop < seed.sql
--
-- این فایل فقط دسته‌بندی‌های اولیه فروشگاه را ثبت می‌کند.
-- اطلاعات واقعی کاربران، محصولات و سفارش‌ها را اینجا قرار ندهید.
-- ============================================

USE delsa_shop;

INSERT INTO categories (name, slug) VALUES
  ('یکبارمصرف', 'disposable'),
  ('تم تولد', 'birthday'),
  ('آشپزخانه', 'kitchen'),
  ('لوازم بهداشتی', 'hygiene')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  is_active = TRUE;
