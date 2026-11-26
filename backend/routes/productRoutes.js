const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

// دریافت همه محصولات
router.get('/', productController.getProducts);

// دریافت یک محصول با شناسه
router.get('/:id', productController.getProductById);

module.exports = router;
