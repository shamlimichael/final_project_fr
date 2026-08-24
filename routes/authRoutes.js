const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/signup', authController.signup_index);

router.post('/signup', authController.signup_post);

router.get('/login', authController.login_index);

router.post('/login', authController.login_post);

router.post('/logout', authController.logout_post);

module.exports = router;