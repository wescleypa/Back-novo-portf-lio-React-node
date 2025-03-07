const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

router.get('/destaque', productsController.buscarProdutosDestaque);
router.get('/buscar', productsController.buscarProduto);

module.exports = router;