
const productModel = require('../models/productModel');

// دریافت محصولات
const getProducts = async (req, res) => {
  try {
    const products = await productModel.getActiveProducts();

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
};

// دریافت یک محصول با شناسه
const getProductById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // بررسی معتبر بودن شناسه
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: 'شناسه محصول معتبر نیست'
      });
    }

    const product = await productModel.getProductById(id);

    // اگر محصول پیدا نشد
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'محصول موردنظر پیدا نشد'
      });
    }

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Get product error:', error);

    res.status(500).json({
      success: false,
      message: 'خطا در دریافت محصول'
    });
  }
};

module.exports = {
  getProducts,
  getProductById
};
