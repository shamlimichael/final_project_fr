const express = require('express');
const userController = require('../controllers/userControllers');

const router = express.Router();

router.post('/settings/username', userController.username_post);

router.post('/settings/password', userController.password_post);

router.post('/settings/delete', userController.delete_post)

router.get('/users/search', userController.search_users);

router.get('/users', userController.users_index);

router.post('/watchlist/:id', userController.watchlist_add);

router.delete('/watchlist/:id', userController.watchlist_remove);

module.exports = router;