require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./backend/config/db');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/' , (req,res) => {
  res.sendFile(path.join(__dirname, 'public', 'landing.html'))
})

app.get('/api/health', (req, res) => {
  res.json({ ok: true, shop: 'Delsa Shop' });
});

// تست اتصال به دیتابیس
app.get('/api/db-test', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 AS result');

    res.json({
      success: true,
      message: 'MySQL connected successfully!',
      data: rows
    });

  } catch (error) {
    console.error('Database connection error:', error);

    res.status(500).json({
      success: false,
      message: 'Database connection failed'
    });
  }
});

// محصولات
app.get('/api/products', async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT
        id,
        name,
        description,
        price,
        stock,
        image,
        category_id
      FROM products
      WHERE is_active = TRUE
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      count: products.length,
      data: products
    });

  } catch (error) {
    console.error('Products API error:', error);

    res.status(500).json({
      success: false,
      message: 'خطا در دریافت محصولات'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));