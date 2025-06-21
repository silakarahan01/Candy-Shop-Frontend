const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Ürün modelini import edin

// GET /api/products - Ürünleri listele
router.get('/', async (req, res) => {
  try {
    const products = await Product.find(); // MongoDB'den ürünleri al
    res.json(products); // Ürünleri JSON olarak gönder
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' }); // Hata durumunda mesaj gönder
  }
});

module.exports = router;
