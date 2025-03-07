const express = require('express');
const authController = require('../controllers/authController');
const peopleController = require('../controllers/peopleController');
const deepseek = require('../controllers/deepseekController');
const productsRouter = require('./products');

const router = express.Router();

router.post('/login', authController.login);
router.post('/search-people', peopleController.searchPeople);
router.post('/getProfile', peopleController.getProfile);
router.post('/ia', deepseek.IA);
router.use('/products', productsRouter);

module.exports = router;