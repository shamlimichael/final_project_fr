const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.get('/admin', adminController.admin_index);

router.post('/admin/coins', adminController.coin_create);

router.post('/admin/coins/:id/delete', adminController.coin_delete);

router.post('/admin/coins/:id/update', adminController.coin_update);


module.exports = router;