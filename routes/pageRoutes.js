const express = require('express');
const pageController = require('../controllers/pageController');

const router = express.Router();

router.get('/', pageController.main_index);

router.get('/api/prices', pageController.prices_get);

router.get('/about', pageController.about_index);

module.exports = router;