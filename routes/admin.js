const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');

// Admin only routes
router.get('/dashboard/stats', authMiddleware, adminController.getDashboardStats);
router.get('/dashboard/overview', authMiddleware, adminController.getDashboardOverview);
router.get('/data', authMiddleware, adminController.getAllData);

module.exports = router;
