require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./backend/config/db');
const productRoutes = require('./backend/routes/productRoutes');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/products', productRoutes);

app.get('/' , (req,res) => {
  res.sendFile(path.join(__dirname, 'public', 'landing.html'))
})

// سلامت سرور
app.get('/api/health', (req, res) => {
  res.json({ ok: true, shop: 'Delsa Shop' });
});

// تست اتصال به mysql
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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));