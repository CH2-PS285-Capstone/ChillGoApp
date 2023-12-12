const express = require('express');
const router = express.Router();
const loginController = require('../controllers/LoginController');

// Rute untuk melakukan login
router.post('/login', loginController.login);

module.exports = router;