
const db = require('../config/db');

// دریافت محصولات فعال
const getActiveProducts = async () => {
  const [products] = await db.query(`
    SELECT
      p.id,
      p.name,
      p.description,
      p.price,
      p.stock,
      p.image,
      p.category_id,
      c.slug AS category
    FROM products AS p
    JOIN categories AS c
      ON p.category_id = c.id
    WHERE p.is_active = TRUE
    ORDER BY p.created_at DESC
  `);

  return products;
};

// دریافت یک محصول با شناسه
const getProductById = async (id) => {
  const [products] = await db.query(
    `
      SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.image,
        p.category_id,
        c.slug AS category
      FROM products AS p
      JOIN categories AS c
        ON p.category_id = c.id
      WHERE p.id = ? AND p.is_active = TRUE
    `,
    [id]
  );

  return products[0] || null;
};

module.exports = {
  getActiveProducts,
  getProductById
};
