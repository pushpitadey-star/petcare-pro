const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Public routes
router.post('/user-login', authController.userLogin);
router.post('/user-register', authController.userRegister);
router.post('/admin-login', authController.adminLogin);
router.get('/check-username/:username', authController.checkUsernameAvailability);

module.exports = router;
