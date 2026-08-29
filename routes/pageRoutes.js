const express = require('express');
const pageController = require('../controllers/pageController');

const router = express.Router();

console.log("Loaded Page Controller Functions:", Object.keys(pageController));

router.get('/', pageController.main_index); 
router.get('/api/prices', pageController.prices_get);
router.get('/api/coin/:ticker', pageController.coin_get);
router.get('/about', pageController.about_index);
router.get('/coin/:ticker', pageController.coin_index);

module.exports = router;