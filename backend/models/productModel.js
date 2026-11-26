
const db = require('../config/db');

// دریافت محصولات فعال
const getActiveProducts = async () => {
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
  return products;
};

// دریافت یک محصول با شناسه
const getProductById = async (id) => {
  const [products] = await db.query(
    `
      SELECT
        id,
        name,
        description,
        price,
        stock,
        image,
        category_id
      FROM products
      WHERE id = ? AND is_active = TRUE
    `,
    [id]
  );

  return products[0] || null;
};

module.exports = {
  getActiveProducts,
  getProductById
};
